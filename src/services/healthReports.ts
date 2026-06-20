import { supabase } from './supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// Ensure EXPO_PUBLIC_GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export const HealthReportService = {
  
  /**
   * Uploads a document to Supabase Storage and creates a database record
   */
  async uploadReport(fileUri: string, petId: string, mimeType: string, fileName: string) {
    try {
      // 1. Convert local URI to Blob for upload
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // 2. Upload to Supabase Storage
      const filePath = `${petId}/${Date.now()}_${fileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('health_reports')
        .upload(filePath, blob, {
          contentType: mimeType,
        });

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('health_reports')
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      // 4. Create record in health_reports table
      const { data: recordData, error: recordError } = await supabase
        .from('health_reports')
        .insert({
          pet_id: petId,
          file_url: fileUrl,
          // ai_prediction will be updated later
        })
        .select()
        .single();

      if (recordError) throw recordError;

      return { success: true, record: recordData };
    } catch (error) {
      console.error('Error uploading report:', error);
      return { success: false, error };
    }
  },

  /**
   * Generates AI Prediction using Gemini and updates the Supabase record
   */
  async generateAIPrediction(reportId: string, fileUri: string, mimeType: string) {
    try {
      if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env");
      }

      // 1. Read file as base64 for Gemini
      // For React Native, we can fetch the local URI as a blob, then read it as base64
      const response = await fetch(fileUri);
      const blob = await response.blob();
      
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // 2. Call Gemini API
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const prompt = `You are an AI-powered Pet Health Risk Assessment assistant. 
Analyze the provided veterinary report, blood test, prescription, or medical record.
Your purpose is early risk detection and preventive care.

CRITICAL RULES:
1. NEVER present results as a confirmed disease diagnosis.
2. Use phrases like "Possible risk detected" or "Abnormal markers suggest".
3. Provide a structured assessment.

Return ONLY a valid JSON object with the following exact structure (no markdown, just JSON):
{
  "overallRisk": "Low" | "Moderate" | "High" | "Urgent",
  "confidence": number (e.g. 78),
  "trend": "Improving" | "Stable" | "Worsening",
  "primaryConcern": "string (brief summary of the main issue or 'None')",
  "riskCategories": [
    {
      "category": "string (e.g., Kidney Health, Heart Health, Weight)",
      "riskLevel": "Low" | "Moderate" | "High",
      "reason": "string (simple language explanation)",
      "recommendedAction": "string (actionable advice)"
    }
  ],
  "explainableFactors": [
    "string (bullet point of a finding influencing the assessment)"
  ],
  "vetUrgency": "No Immediate Concern" | "Monitor Closely" | "Schedule Vet Visit" | "Visit Vet Soon",
  "suggestedActions": [
    "string (short actionable step like 'Increase exercise')"
  ]
}`;
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);
      
      const predictionText = result.response.text();

      // 3. Save prediction back to Supabase
      const { error: updateError } = await supabase
        .from('health_reports')
        .update({ ai_prediction: predictionText })
        .eq('id', reportId);

      if (updateError) throw updateError;

      return { success: true, prediction: predictionText };
    } catch (error) {
      console.error('Error generating AI prediction:', error);
      return { success: false, error };
    }
  },

  /**
   * Fetches past reports for a pet
   */
  async getReportHistory(petId: string) {
    try {
      const { data, error } = await supabase
        .from('health_reports')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, history: data };
    } catch (error) {
      console.error('Error fetching report history:', error);
      return { success: false, error };
    }
  },

  /**
   * Chats with Gemini about a specific report
   */
  async chatAboutReport(reportData: any, userMessage: string, chatHistory: {role: string, parts: {text: string}[]}[] = []) {
    try {
      if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const systemContext = `You are a helpful and knowledgeable veterinary AI assistant. 
You are chatting with a pet owner about their pet's health report.
Here is the structured data of the report you just analyzed:
${JSON.stringify(reportData, null, 2)}

Answer the user's questions based primarily on this report context. 
If they ask for general advice, provide it but ALWAYS add a disclaimer that you are an AI and they should consult their vet.
Keep your responses conversational, empathetic, and concise.`;

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemContext }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I am ready to answer questions about this report." }],
          },
          ...chatHistory
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const responseText = result.response.text();

      return { success: true, reply: responseText };
    } catch (error) {
      console.error('Error chatting with AI:', error);
      return { success: false, error };
    }
  }
};

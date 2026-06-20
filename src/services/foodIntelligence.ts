import { GoogleGenerativeAI } from '@google/generative-ai';
import { FoodBaseline } from '../store/usePetStore';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export async function analyzeDailyLog(baseline: FoodBaseline, dailyLog: any) {
  try {
    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      console.warn("Gemini API key is missing. Returning mock data.");
      // Return mock data for testing if no key is provided
      return {
        success: true,
        data: {
          currentStatus: dailyLog.foodIntake === 'Ate everything' ? 'Normal' : 'Significant Change',
          foodConsistency: dailyLog.foodIntake === 'Ate everything' ? 'Maintained' : 'Changed',
          appetite: dailyLog.foodIntake === 'Ate everything' ? 'Normal' : 'Reduced',
          waterIntake: dailyLog.waterIntake,
          aiObservation: `Your pet ${dailyLog.foodIntake.toLowerCase()} and water intake is ${dailyLog.waterIntake.toLowerCase()}.`,
          foodRoutineImpact: dailyLog.foodIntake === 'Ate everything' ? 'Low' : 'Moderate',
          reason: `Observed changes from the usual baseline.`,
          healthRiskModifier: dailyLog.foodIntake === 'Ate everything' ? 0 : 5
        }
      };
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are a Pet Food Routine Intelligence AI.
Your objective is to compare today's feeding behavior against the pet's normal baseline and detect meaningful deviations.

CRITICAL RULES:
1. NEVER judge whether a food brand or diet is good or bad.
2. NEVER say "This food is unhealthy".
3. NEVER rank food brands.
4. ONLY focus on changes from the baseline, appetite trends, feeding consistency, and water trends.
5. Return ONLY a valid JSON object matching the exact structure requested.

BASELINE (Normal Routine):
Food Type: ${baseline.foodType}
Details: ${baseline.details}
Average Quantity: ${baseline.avgQuantity}
Water Intake: ${baseline.waterIntake}

TODAY'S LOG:
Food Intake: ${dailyLog.foodIntake}
Timing: ${dailyLog.timing}
Water Intake: ${dailyLog.waterIntake}
Symptoms Observed: ${dailyLog.symptoms.join(', ')}

Return JSON exactly like this:
{
  "currentStatus": "Normal" | "Slight Change" | "Significant Change",
  "foodConsistency": "Maintained" | "Changed",
  "appetite": "Normal" | "Reduced" | "Increased",
  "waterIntake": "Normal" | "Reduced" | "Increased",
  "aiObservation": "string (A human-friendly explanation of the changes, e.g., 'Your pet consumed only 50% of its usual food intake today and missed one scheduled meal.')",
  "foodRoutineImpact": "Low" | "Moderate" | "High",
  "reason": "string (Why the impact is what it is, e.g., 'Breakfast was skipped.')",
  "healthRiskModifier": number (0 for normal, 5 for moderate concern, 10 for high concern)
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    return { success: true, data: JSON.parse(responseText) };
  } catch (error) {
    console.error('Error analyzing food routine:', error);
    return { success: false, error };
  }
}

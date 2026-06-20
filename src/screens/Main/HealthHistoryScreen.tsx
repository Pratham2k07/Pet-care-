import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HealthReportService } from '../../services/healthReports';

export default function HealthHistoryScreen({ route, navigation }: any) {
  const { pet } = route.params || {};
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!pet) return null;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    const res = await HealthReportService.getReportHistory(pet.id);
    if (res.success && res.history && res.history.length > 0) {
      setHistory(res.history);
    } else {
      // Mock history for demo purposes if nothing exists or supabase is not connected
      setHistory([
        {
          id: 'demo-1',
          created_at: new Date().toISOString(),
          ai_prediction: JSON.stringify({
            overallRisk: "Moderate",
            confidence: 85,
            trend: "Worsening",
            primaryConcern: "Reduced activity and abnormal kidney markers detected in recent blood work.",
            vetUrgency: "Monitor Closely"
          })
        }
      ]);
    }
    setIsLoading(false);
  };

  const handlePressRecord = (record: any) => {
    // Navigate to dashboard and pass the parsed prediction data
    try {
      const data = JSON.parse(record.ai_prediction);
      navigation.navigate('HealthPrediction', { pet, preloadedData: data });
    } catch (e) {
      console.log('Error parsing record', e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Reports</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{pet.name}'s Medical History</Text>
        <Text style={styles.subtitle}>View past AI risk assessments or upload a new report.</Text>

        <TouchableOpacity 
          style={styles.uploadBtn}
          onPress={() => navigation.navigate('HealthPrediction', { pet })}
        >
          <Ionicons name="add-circle" size={24} color="#FFF" style={{marginRight: 8}} />
          <Text style={styles.uploadBtnText}>Upload New Report</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Past Reports</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#38BDF8" style={{marginTop: 40}} />
        ) : history.length === 0 ? (
          <Text style={styles.emptyText}>No past reports found.</Text>
        ) : (
          history.map((item, index) => {
            let data: any = {};
            try { data = JSON.parse(item.ai_prediction); } catch(e){}
            
            const date = new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            });

            const color = data.overallRisk === 'Urgent' ? '#EF4444' : 
                          data.overallRisk === 'High' ? '#F97316' : 
                          data.overallRisk === 'Moderate' ? '#F59E0B' : '#10B981';

            return (
              <TouchableOpacity 
                key={item.id || index} 
                style={styles.historyCard}
                onPress={() => handlePressRecord(item)}
              >
                <View style={[styles.iconBg, { backgroundColor: color + '1A' }]}>
                  <Ionicons name="document-text" size={24} color={color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardDate}>{date}</Text>
                  <Text style={styles.cardRisk}>{data.overallRisk || 'Unknown'} Risk</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  uploadBtn: {
    backgroundColor: '#38BDF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardRisk: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  }
});

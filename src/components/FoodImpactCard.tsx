import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { DailyLog } from '../store/usePetStore';

interface Props {
  latestLog?: DailyLog;
}

export default function FoodImpactCard({ latestLog }: Props) {
  if (!latestLog || !latestLog.aiObservation) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBg, { backgroundColor: '#F0FDF4' }]}>
            <MaterialCommunityIcons name="food-apple" size={20} color="#10B981" />
          </View>
          <Text style={styles.title}>Food & Feeding Analysis</Text>
        </View>
        <Text style={styles.emptyText}>Log your pet's feeding behavior today to see AI observations.</Text>
      </View>
    );
  }

  let aiData: any = {};
  try {
    aiData = JSON.parse(latestLog.aiObservation);
  } catch (e) {
    return null;
  }

  const getStatusColor = (status: string) => {
    if (status === 'Normal') return '#10B981';
    if (status === 'Slight Change') return '#F59E0B';
    return '#EF4444';
  };

  const statusColor = getStatusColor(aiData.currentStatus);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: statusColor + '20' }]}>
          <MaterialCommunityIcons name="food-apple" size={20} color={statusColor} />
        </View>
        <View>
          <Text style={styles.title}>Food & Feeding Analysis</Text>
          <Text style={[styles.statusBadge, { color: statusColor }]}>{aiData.currentStatus}</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Appetite</Text>
          <Text style={styles.metricValue}>{aiData.appetite}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Consistency</Text>
          <Text style={styles.metricValue}>{aiData.foodConsistency}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Hydration</Text>
          <Text style={styles.metricValue}>{aiData.waterIntake}</Text>
        </View>
      </View>

      <View style={styles.observationBox}>
        <Ionicons name="sparkles" size={16} color="#6366F1" style={{marginTop: 2, marginRight: 8}} />
        <Text style={styles.observationText}>{aiData.aiObservation}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  observationBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
  },
  observationText: {
    flex: 1,
    fontSize: 13,
    color: '#4F46E5',
    lineHeight: 20,
    fontWeight: '500',
  }
});

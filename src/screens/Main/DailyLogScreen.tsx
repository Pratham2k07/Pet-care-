import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePetStore } from '../../store/usePetStore';
import { analyzeDailyLog } from '../../services/foodIntelligence';

const FOOD_OPTIONS = ['Ate everything', 'Ate most of it', 'Ate half', 'Ate very little', 'Did not eat'];
const TIMING_OPTIONS = ['Usual time', 'Slightly delayed', 'Missed meal'];
const WATER_OPTIONS = ['Normal', 'Increased', 'Reduced'];
const SYMPTOM_OPTIONS = ['None', 'Vomiting', 'Diarrhea', 'Itching', 'Low energy', 'Excessive sleeping', 'Excessive thirst', 'Reduced appetite'];

export default function DailyLogScreen({ route, navigation }: any) {
  const { pet } = route.params || {};
  const { addDailyLog } = usePetStore();

  const [foodIntake, setFoodIntake] = useState('Ate everything');
  const [timing, setTiming] = useState('Usual time');
  const [waterIntake, setWaterIntake] = useState('Normal');
  const [symptoms, setSymptoms] = useState<string[]>(['None']);
  
  // Quick Checkboxes State
  const [isFoodNormal, setIsFoodNormal] = useState(true);
  const [isTimingNormal, setIsTimingNormal] = useState(true);
  const [isWaterNormal, setIsWaterNormal] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pet) return null;

  const toggleSymptom = (symptom: string) => {
    if (symptom === 'None') {
      setSymptoms(['None']);
      return;
    }
    
    let newSymptoms = symptoms.filter(s => s !== 'None');
    if (newSymptoms.includes(symptom)) {
      newSymptoms = newSymptoms.filter(s => s !== symptom);
      if (newSymptoms.length === 0) newSymptoms = ['None'];
    } else {
      newSymptoms.push(symptom);
    }
    setSymptoms(newSymptoms);
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    const logData = {
      foodIntake: isFoodNormal ? 'Ate everything' : foodIntake,
      timing: isTimingNormal ? 'Usual time' : timing,
      waterIntake: isWaterNormal ? 'Normal' : waterIntake,
      symptoms
    };

    // Call AI to analyze deviation from baseline
    let aiObservationStr: string | undefined = undefined;
    if (pet.foodBaseline) {
      const res = await analyzeDailyLog(pet.foodBaseline, logData);
      if (res.success && res.data) {
        aiObservationStr = JSON.stringify(res.data);
      }
    }

    const newLog = {
      id: Date.now().toString(),
      petId: pet.id,
      date: new Date().toISOString(),
      ...logData,
      aiObservation: aiObservationStr
    };

    addDailyLog(newLog);
    setIsSubmitting(false);
    navigation.goBack();
  };

  const renderRadioGroup = (title: string, options: string[], selected: string, onSelect: (val: string) => void) => (
    <View style={styles.formGroup}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {options.map((opt) => (
        <TouchableOpacity 
          key={opt}
          style={[styles.radioItem, selected === opt && styles.radioItemActive]}
          onPress={() => onSelect(opt)}
        >
          <View style={[styles.radioCircle, selected === opt && styles.radioCircleActive]}>
            {selected === opt && <View style={styles.radioInner} />}
          </View>
          <Text style={[styles.radioText, selected === opt && styles.radioTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={isSubmitting}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Health Log</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>How is {pet.name} doing today?</Text>
        <Text style={styles.subtitle}>Use the quick checkboxes if everything is normal, or uncheck them to provide details.</Text>

        {/* Quick Checkboxes */}
        <View style={styles.quickCard}>
          <TouchableOpacity 
            style={styles.quickCheckRow}
            onPress={() => setIsFoodNormal(!isFoodNormal)}
          >
            <View style={[styles.checkbox, isFoodNormal && styles.checkboxActive]}>
              {isFoodNormal && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </View>
            <Text style={styles.quickCheckText}>Ate normal amount</Text>
          </TouchableOpacity>

          {!isFoodNormal && (
            <View style={styles.expandedSection}>
              {renderRadioGroup("How much did they eat?", FOOD_OPTIONS.filter(o => o !== 'Ate everything'), foodIntake === 'Ate everything' ? 'Ate most of it' : foodIntake, setFoodIntake)}
            </View>
          )}

          <TouchableOpacity 
            style={styles.quickCheckRow}
            onPress={() => setIsTimingNormal(!isTimingNormal)}
          >
            <View style={[styles.checkbox, isTimingNormal && styles.checkboxActive]}>
              {isTimingNormal && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </View>
            <Text style={styles.quickCheckText}>Ate at usual time</Text>
          </TouchableOpacity>

          {!isTimingNormal && (
            <View style={styles.expandedSection}>
              {renderRadioGroup("When did they eat?", TIMING_OPTIONS.filter(o => o !== 'Usual time'), timing === 'Usual time' ? 'Slightly delayed' : timing, setTiming)}
            </View>
          )}

          <TouchableOpacity 
            style={styles.quickCheckRow}
            onPress={() => setIsWaterNormal(!isWaterNormal)}
          >
            <View style={[styles.checkbox, isWaterNormal && styles.checkboxActive]}>
              {isWaterNormal && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </View>
            <Text style={styles.quickCheckText}>Normal water intake</Text>
          </TouchableOpacity>

          {!isWaterNormal && (
            <View style={styles.expandedSection}>
              {renderRadioGroup("Water intake was:", WATER_OPTIONS.filter(o => o !== 'Normal'), waterIntake === 'Normal' ? 'Increased' : waterIntake, setWaterIntake)}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Any symptoms observed?</Text>
          <View style={styles.chipRow}>
            {SYMPTOM_OPTIONS.map((sym) => {
              const isActive = symptoms.includes(sym);
              return (
                <TouchableOpacity 
                  key={sym}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => toggleSymptom(sym)}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{sym}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="content-save-outline" size={20} color="#FFF" style={{marginRight: 8}} />
              <Text style={styles.saveBtnText}>Save Log & Analyze</Text>
            </>
          )}
        </TouchableOpacity>

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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  formGroup: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radioItemActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleActive: {
    borderColor: '#6366F1',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  radioText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  radioTextActive: {
    color: '#1E293B',
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  chipText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#38BDF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  quickCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  quickCheckText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  expandedSection: {
    marginLeft: 36,
    marginTop: 8,
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#F1F5F9',
  }
});

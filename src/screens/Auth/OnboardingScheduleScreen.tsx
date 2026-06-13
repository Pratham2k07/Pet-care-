import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePetStore } from '../../store/usePetStore';

// Generate 48 time slots for a full 24-hour clock (every 30 mins)
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const ampm = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedHour = displayHour.toString().padStart(2, '0');
  return `${formattedHour}:${minute} ${ampm}`;
});

export default function OnboardingScheduleScreen({ route, navigation }: any) {
  const [wakeTime, setWakeTime] = useState('');
  
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [breakfast, setBreakfast] = useState({ time: '', type: '' });
  const [lunch, setLunch] = useState({ time: '', type: '' });
  const [dinner, setDinner] = useState({ time: '', type: '' });

  const [walkTimes, setWalkTimes] = useState<string[]>(['']);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { petId } = route.params || {};
  const { updatePet } = usePetStore();

  const handleComplete = () => {
    if (petId) {
      updatePet(petId, {
        wakeTime,
        breakfast: breakfast.time ? breakfast : undefined,
        lunch: lunch.time ? lunch : undefined,
        dinner: dinner.time ? dinner : undefined,
        walkTimes: walkTimes.filter(t => t !== '')
      });
    }
    navigation.navigate('MainApp');
  };

  const addWalk = () => {
    if (walkTimes.length < 4) setWalkTimes([...walkTimes, '']);
  };

  const removeWalk = () => {
    if (walkTimes.length > 1) setWalkTimes(walkTimes.slice(0, -1));
  };

  const updateWalkTime = (index: number, time: string) => {
    const newWalks = [...walkTimes];
    newWalks[index] = time;
    setWalkTimes(newWalks);
  };

  const renderDropdown = (currentValue: string, onSelect: (val: string) => void, id: string) => {
    if (activeDropdown !== id) return null;

    let validTimeSlots = TIME_SLOTS;
    const getIndex = (t: string) => TIME_SLOTS.findIndex(ts => ts.toLowerCase() === t.toLowerCase());

    if (id === 'Breakfast' && wakeTime) {
      const idx = getIndex(wakeTime);
      if (idx !== -1) validTimeSlots = TIME_SLOTS.slice(idx + 1); // +30 mins
    } else if (id === 'Lunch' && breakfast.time) {
      const idx = getIndex(breakfast.time);
      if (idx !== -1) validTimeSlots = TIME_SLOTS.slice(idx + 2); // +1 hour
    } else if (id === 'Dinner' && lunch.time) {
      const idx = getIndex(lunch.time);
      if (idx !== -1) validTimeSlots = TIME_SLOTS.slice(idx + 4); // +2 hours
    }

    const filtered = validTimeSlots.filter(t => t.toLowerCase().includes(currentValue.toLowerCase()));
    
    return (
      <View style={styles.dropdownContainer}>
        <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  setActiveDropdown(null);
                }}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownTextInactive}>No times found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderMealAccordion = (title: string, icon: any, color: string, bg: string, state: any, setState: any) => {
    const isExpanded = expandedMeal === title;
    return (
      <View style={[styles.accordionContainer, { zIndex: isExpanded ? 10 : 1 }]}>
        <TouchableOpacity 
          style={styles.accordionHeader} 
          onPress={() => {
            setExpandedMeal(isExpanded ? null : title);
            setActiveDropdown(null);
          }}
        >
          <View style={styles.accordionHeaderLeft}>
            <View style={[styles.iconBg, { backgroundColor: bg }]}>
              {icon}
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={[styles.accordionContent, { zIndex: 10 }]}>
            <View style={[styles.formGroup, { zIndex: 20 }]}>
              <Text style={styles.label}>Time</Text>
              <View style={{ position: 'relative' }}>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 08:00 AM" 
                  placeholderTextColor="#9CA3AF"
                  value={state.time}
                  onChangeText={(text) => {
                    setState({...state, time: text});
                    setActiveDropdown(title);
                  }}
                  onFocus={() => setActiveDropdown(title)}
                />
                {renderDropdown(state.time, (val) => setState({...state, time: val}), title)}
              </View>
            </View>
            <View style={[styles.formGroup, { zIndex: 1 }]}>
              <Text style={styles.label}>Type of Food</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. Dry Kibble, Wet Food" 
                placeholderTextColor="#9CA3AF"
                value={state.type}
                onChangeText={(text) => setState({...state, type: text})}
                onFocus={() => setActiveDropdown(null)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Daily Routine</Text>
              <Text style={styles.subtitle}>When do they eat and play?</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Wake Up Time Dropdown */}
          <View style={[styles.card, { zIndex: 30 }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBg, { backgroundColor: '#FEF08A' }]}>
                <Ionicons name="sunny" size={20} color="#CA8A04" />
              </View>
              <Text style={styles.cardTitle}>Wake Up Time</Text>
            </View>
            <View style={{ position: 'relative', zIndex: 10 }}>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. 07:00 AM" 
                placeholderTextColor="#9CA3AF"
                value={wakeTime}
                onChangeText={(text) => {
                  setWakeTime(text);
                  setActiveDropdown('wake');
                }}
                onFocus={() => setActiveDropdown('wake')}
              />
              {renderDropdown(wakeTime, setWakeTime, 'wake')}
            </View>
          </View>

          {/* Meals Accordion */}
          <Text style={styles.sectionTitle}>Feeding Schedule</Text>
          <View style={[styles.mealsWrapper, { zIndex: 20 }]}>
            {renderMealAccordion(
              "Breakfast", 
              <MaterialCommunityIcons name="egg-fried" size={20} color="#C2410C" />, 
              "#C2410C", 
              "#FED7AA", 
              breakfast, 
              setBreakfast
            )}
            {renderMealAccordion(
              "Lunch", 
              <MaterialCommunityIcons name="food-apple" size={20} color="#15803D" />, 
              "#15803D", 
              "#BBF7D0", 
              lunch, 
              setLunch
            )}
            {renderMealAccordion(
              "Dinner", 
              <MaterialCommunityIcons name="bowl" size={20} color="#4338CA" />, 
              "#4338CA", 
              "#C7D2FE", 
              dinner, 
              setDinner
            )}
          </View>

          {/* Walking Time */}
          <View style={[styles.card, { zIndex: 10 }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBg, { backgroundColor: '#FBCFE8' }]}>
                <FontAwesome5 name="walking" size={18} color="#BE185D" />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.cardTitle}>Walking / Play</Text>
                <View style={styles.counterRow}>
                  <TouchableOpacity onPress={removeWalk} style={styles.counterBtn}>
                    <Ionicons name="remove" size={16} color="#BE185D" />
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{walkTimes.length}</Text>
                  <TouchableOpacity onPress={addWalk} style={styles.counterBtn}>
                    <Ionicons name="add" size={16} color="#BE185D" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {walkTimes.map((time, index) => (
              <View key={index} style={{ position: 'relative', marginBottom: index === walkTimes.length - 1 ? 0 : 16, zIndex: 10 - index }}>
                <Text style={[styles.label, { marginBottom: 6 }]}>Walk {index + 1} Time</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 07:00 AM" 
                  placeholderTextColor="#9CA3AF"
                  value={time}
                  onChangeText={(text) => {
                    updateWalkTime(index, text);
                    setActiveDropdown(`walk-${index}`);
                  }}
                  onFocus={() => setActiveDropdown(`walk-${index}`)}
                />
                {renderDropdown(time, (val) => updateWalkTime(index, val), `walk-${index}`)}
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />

          <TouchableOpacity 
            style={[styles.nextBtn, { zIndex: 1 }]}
            onPress={handleComplete}
          >
            <Text style={styles.nextBtnText}>Complete Setup</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  mealsWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownScroll: {
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  dropdownText: {
    fontSize: 15,
    color: '#1E293B',
  },
  dropdownTextInactive: {
    fontSize: 15,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  nextBtn: {
    backgroundColor: '#FF8BA7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#FF8BA7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE7F3',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  counterBtn: {
    padding: 4,
  },
  counterText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#BE185D',
    marginHorizontal: 12,
  },
});

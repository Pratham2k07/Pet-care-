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
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../store/useAuth';
import { usePetStore } from '../../store/usePetStore';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { pets, ownerName, setOwnerName, updatePet } = usePetStore();
  
  const activePet = pets[0]; // Assuming MVP has 1 pet

  const [localOwnerName, setLocalOwnerName] = useState(ownerName || '');
  const [petName, setPetName] = useState(activePet?.name || '');
  const [petAge, setPetAge] = useState(activePet?.age?.replace(' yrs', '') || '');
  const [petWeight, setPetWeight] = useState(activePet?.weight?.replace(' kg', '') || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const displayName = ownerName || user?.user_metadata?.full_name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};
    if (!localOwnerName.trim()) newErrors.ownerName = 'Your name is required';
    if (!petName.trim()) newErrors.name = 'Pet name is required';
    if (!petAge.trim()) newErrors.age = 'Age is required';
    if (!petWeight.trim()) newErrors.weight = 'Weight is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    setOwnerName(localOwnerName.trim());
    if (activePet) {
      updatePet(activePet.id, {
        name: petName.trim(),
        age: `${petAge.trim()} yrs`,
        weight: `${petWeight.trim()} kg`,
      });
    }
    
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        usePetStore.getState().reset();
        await signOut();
      } }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Profile Settings</Text>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>

          {/* Owner Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Information</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput 
                style={[styles.input, errors.ownerName && styles.inputError]} 
                placeholder="e.g. Alex" 
                placeholderTextColor="#9CA3AF"
                value={localOwnerName}
                onChangeText={(text) => {
                  setLocalOwnerName(text);
                  setErrors({...errors, ownerName: ''});
                }}
              />
              {errors.ownerName && <Text style={styles.errorText}>{errors.ownerName}</Text>}
            </View>
          </View>

          {/* Pet Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pet Information</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Pet Name</Text>
              <TextInput 
                style={[styles.input, errors.name && styles.inputError]} 
                placeholder="e.g. Bella" 
                placeholderTextColor="#9CA3AF"
                value={petName}
                onChangeText={(text) => {
                  setPetName(text);
                  setErrors({...errors, name: ''});
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Age (Years)</Text>
                <TextInput 
                  style={[styles.input, errors.age && styles.inputError]} 
                  placeholder="e.g. 2" 
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={petAge}
                  onChangeText={(text) => {
                    setPetAge(text);
                    setErrors({...errors, age: ''});
                  }}
                />
                {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput 
                  style={[styles.input, errors.weight && styles.inputError]} 
                  placeholder="e.g. 5" 
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={petWeight}
                  onChangeText={(text) => {
                    setPetWeight(text);
                    setErrors({...errors, weight: ''});
                  }}
                />
                {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveBtn}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, minHeight: 40 }} />

          <TouchableOpacity 
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{marginRight: 8}} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
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
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF8BA7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#FF8BA7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emailText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
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
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

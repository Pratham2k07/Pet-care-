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
import { Ionicons } from '@expo/vector-icons';
import { usePetStore } from '../../store/usePetStore';

export default function OnboardingPetInfoScreen({ navigation }: any) {
  const [ownerName, setOwnerNameLocal] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const DOG_BREEDS = ['Golden Retriever', 'Labrador', 'Shih Tzu', 'Pug', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund', 'Siberian Husky', 'Great Dane', 'Doberman', 'Chihuahua', 'Mixed Breed'];
  const CAT_BREEDS = ['Persian', 'Maine Coon', 'Siamese', 'Ragdoll', 'Bengal', 'Abyssinian', 'Birman', 'Oriental Shorthair', 'Sphynx', 'Devon Rex', 'Himalayan', 'American Shorthair', 'British Shorthair', 'Scottish Fold', 'Mixed Breed'];

  const currentBreeds = petType === 'Dog' ? DOG_BREEDS : CAT_BREEDS;
  const filteredBreeds = currentBreeds.filter(b => b.toLowerCase().includes(breed.toLowerCase()));

  const { addPet, setOwnerName } = usePetStore();

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};
    if (!ownerName.trim()) newErrors.ownerName = 'Your name is required';
    if (!name.trim()) newErrors.name = 'Pet name is required';
    if (!age.trim()) newErrors.age = 'Age is required';
    if (!weight.trim()) newErrors.weight = 'Weight is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const newId = Date.now().toString();
    // Default mock images based on type if no photo is uploaded
    const mockImage = petType === 'Dog' 
      ? require('../../../assets/theme1.jpeg') 
      : require('../../../assets/theme2.jpeg');
      
    setOwnerName(ownerName.trim());
    addPet({
      id: newId,
      name: name.trim(),
      type: petType,
      breed: breed.trim() || 'Unknown Breed',
      age: `${age.trim()} yrs`,
      weight: `${weight.trim()} kg`,
      image: mockImage,
      bg: petType === 'Dog' ? '#FFF7E6' : '#FFF0E6'
    });
    
    navigation.navigate('OnboardingSchedule', { petId: newId });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              import('../../services/supabase').then(s => s.supabase.auth.signOut());
            }} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Tell us about your pet!</Text>
              <Text style={styles.subtitle}>Let's set up their profile.</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Owner Info */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput 
              style={[styles.input, errors.ownerName && styles.inputError]} 
              placeholder="e.g. Alex" 
              placeholderTextColor="#9CA3AF"
              value={ownerName}
              onChangeText={(text) => {
                setOwnerNameLocal(text);
                setErrors({...errors, ownerName: ''});
              }}
            />
            {errors.ownerName && <Text style={styles.errorText}>{errors.ownerName}</Text>}
          </View>

          {/* Pet Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeBtn, petType === 'Dog' && styles.typeBtnActive]}
              onPress={() => {
                setPetType('Dog');
                setBreed('');
              }}
            >
              <Text style={petType === 'Dog' ? styles.typeTextActive : styles.typeTextInactive}>🐶 Dog</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeBtn, petType === 'Cat' && styles.typeBtnActive]}
              onPress={() => {
                setPetType('Cat');
                setBreed('');
              }}
            >
              <Text style={petType === 'Cat' ? styles.typeTextActive : styles.typeTextInactive}>🐱 Cat</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pet Name</Text>
            <TextInput 
              style={[styles.input, errors.name && styles.inputError]} 
              placeholder="e.g. Bella" 
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({...errors, name: ''});
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={[styles.formGroup, { zIndex: 10 }]}>
            <Text style={styles.label}>Breed</Text>
            <View style={{ position: 'relative' }}>
              <TextInput 
                style={styles.input} 
                placeholder={petType === 'Dog' ? "e.g. Shih Tzu" : "e.g. Persian"} 
                placeholderTextColor="#9CA3AF"
                value={breed}
                onChangeText={(text) => {
                  setBreed(text);
                  setShowBreedDropdown(true);
                }}
                onFocus={() => setShowBreedDropdown(true)}
              />
              {showBreedDropdown && (
                <View style={styles.dropdownContainer}>
                  <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                    {filteredBreeds.length > 0 ? (
                      filteredBreeds.map((item) => (
                        <TouchableOpacity 
                          key={item} 
                          style={styles.dropdownItem}
                          onPress={() => {
                            setBreed(item);
                            setShowBreedDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>{item}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.dropdownItem}>
                        <Text style={styles.dropdownTextInactive}>No breeds found</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Age (Years)</Text>
              <TextInput 
                style={[styles.input, errors.age && styles.inputError]} 
                placeholder="e.g. 2" 
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={age}
                onChangeText={(text) => {
                  setAge(text);
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
                value={weight}
                onChangeText={(text) => {
                  setWeight(text);
                  setErrors({...errors, weight: ''});
                }}
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity 
            style={styles.nextBtn}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>Next: Setup Schedule</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF0F5',
    borderWidth: 2,
    borderColor: '#FF8BA7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    color: '#FF8BA7',
    fontWeight: '600',
    marginTop: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  typeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTextActive: {
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 16,
  },
  typeTextInactive: {
    fontWeight: '600',
    color: '#94A3B8',
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
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
    zIndex: 1,
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
    marginTop: 20,
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
});

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PetServicesScreen({ route, navigation }: any) {
  // We expect a pet object passed via navigation params
  const { pet } = route.params || {};

  if (!pet) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet Services</Text>
          <View style={{width: 24}} />
        </View>

        {/* Pet Profile Header */}
        <View style={styles.petHeaderContainer}>
          <View style={[styles.petImageContainer, { backgroundColor: pet.bg }]}>
            <Image source={pet.image} style={styles.petImage} resizeMode="cover" />
          </View>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed}</Text>
        </View>

        {/* Daily Log System */}
        <Text style={styles.sectionTitle}>Daily Tracking</Text>
        <TouchableOpacity 
          style={styles.aiPredictionCard}
          onPress={() => navigation.navigate('DailyLog', { pet })}
        >
          <View style={[styles.serviceIconBg, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="clipboard" size={32} color="#3B82F6" />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle}>Log Daily Health</Text>
            <Text style={styles.serviceDesc}>Track eating habits and symptoms to feed the AI.</Text>
          </View>
          <View style={styles.serviceArrow}>
            <Ionicons name="add-circle" size={20} color="#3B82F6" />
          </View>
        </TouchableOpacity>

        {/* Services Grid */}
        <Text style={styles.sectionTitle}>Book Appointments</Text>
        <View style={styles.servicesGrid}>
          
          <TouchableOpacity style={styles.serviceCard}>
            <View style={[styles.serviceIconBg, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="medical-outline" size={32} color="#0EA5E9" />
            </View>
            <Text style={styles.serviceTitle}>Vet Clinic</Text>
            <Text style={styles.serviceSub}>Book checkup</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}>
            <View style={[styles.serviceIconBg, { backgroundColor: '#FFE4E6' }]}>
              <MaterialCommunityIcons name="content-cut" size={32} color="#E11D48" />
            </View>
            <Text style={styles.serviceTitle}>Grooming</Text>
            <Text style={styles.serviceSub}>Spa & styling</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}>
            <View style={[styles.serviceIconBg, { backgroundColor: '#DCFCE7' }]}>
              <MaterialCommunityIcons name="dog-service" size={32} color="#16A34A" />
            </View>
            <Text style={styles.serviceTitle}>Walking</Text>
            <Text style={styles.serviceSub}>Schedule walk</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}>
            <View style={[styles.serviceIconBg, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="bone" size={32} color="#D97706" />
            </View>
            <Text style={styles.serviceTitle}>Food</Text>
            <Text style={styles.serviceSub}>Order supplies</Text>
          </TouchableOpacity>

        </View>

        {/* AI Health Prediction */}
        <Text style={styles.sectionTitle}>AI Health Insights</Text>
        <TouchableOpacity 
          style={styles.aiPredictionCard}
          onPress={() => navigation.navigate('HealthHistory', { pet })}
        >
          <View style={[styles.serviceIconBg, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="sparkles" size={32} color="#10B981" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.serviceTitle}>Predict Health Risks</Text>
            <Text style={styles.serviceSub}>Upload vet reports for AI analysis</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}>
              <MaterialCommunityIcons name="walk" size={20} color="#16A34A" />
            </View>
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>30 Min Walk Completed</Text>
              <Text style={styles.activityTime}>Yesterday, 5:30 PM</Text>
            </View>
          </View>
          
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="medical" size={20} color="#0EA5E9" />
            </View>
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>Annual Vaccination</Text>
              <Text style={styles.activityTime}>Oct 12, 2025</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
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
  petHeaderContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  petImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  petImage: {
    width: 180,
    height: 180,
    marginTop: 20,
  },
  petName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  serviceCard: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: '2.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  aiPredictionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  serviceSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  serviceArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityList: {
    paddingHorizontal: 24,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#94A3B8',
  },
});

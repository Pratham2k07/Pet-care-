import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../store/useAuth';
import { usePetStore } from '../../store/usePetStore';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { pets, dailyLogs, ownerName } = usePetStore();
  
  const displayName = ownerName || user?.user_metadata?.full_name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  // For the demo, we just use the first pet's latest log
  const activePet = pets[0];
  const latestLog = activePet ? dailyLogs.find(log => log.petId === activePet.id) : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.username}>{displayName}! 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#1E293B" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={[styles.profilePic, { backgroundColor: '#FF8BA7', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{initial}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal Pet Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Pets</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>+ Add Pet</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            snapToInterval={width * 0.75 + 16} // width of card + margin
            decelerationRate="fast"
          >
            {pets.map((pet) => (
              <TouchableOpacity 
                key={pet.id} 
                style={[styles.carouselCard, { backgroundColor: pet.bg }]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('PetServices', { pet })}
              >
                <View style={styles.carouselContent}>
                  <View>
                    <Text style={styles.carouselPetName}>{pet.name}</Text>
                    <Text style={styles.carouselPetBreed}>{pet.breed}</Text>
                    <View style={styles.ageBadge}>
                      <Text style={styles.ageText}>{pet.age}</Text>
                    </View>
                  </View>
                  <View style={styles.manageBtnWrapper}>
                    <Text style={styles.manageBtnTextMinimal}>Manage</Text>
                    <Ionicons name="chevron-forward" size={14} color="#FF8BA7" />
                  </View>
                </View>
                
                <Image 
                  source={pet.image} 
                  style={styles.carouselPetImage} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Schedule */}
        <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleIconBg}>
            <FontAwesome5 name="stethoscope" size={24} color="#0EA5E9" />
          </View>
          <View style={styles.scheduleContent}>
            <Text style={styles.scheduleTitle}>Vet Appointment</Text>
            <Text style={styles.scheduleSubtitle}>Dr. Smith's Clinic • Bella</Text>
            <View style={styles.scheduleTimeRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={styles.scheduleTimeText}>Tomorrow, 10:00 AM</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.dailyLogBtn}
          onPress={() => activePet && navigation.navigate('DailyLog', { pet: activePet })}
        >
          <View style={styles.dailyLogBtnContent}>
            <Ionicons name="clipboard" size={24} color="#FFF" style={{marginRight: 12}} />
            <View>
              <Text style={styles.dailyLogBtnTitle}>Log Daily Health</Text>
              <Text style={styles.dailyLogBtnDesc}>Track today's feeding & behavior</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Discover & Tips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discover & Tips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tipsContainer}>
          <TouchableOpacity style={styles.tipCard}>
            <Image 
              source={{uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300&h=200'}} 
              style={styles.tipImage} 
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipCategory}>GROOMING</Text>
              <Text style={styles.tipTitle} numberOfLines={2}>5 Summer Grooming Tips for Dogs</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tipCard}>
            <Image 
              source={{uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=200'}} 
              style={styles.tipImage} 
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipCategory}>NUTRITION</Text>
              <Text style={styles.tipTitle} numberOfLines={2}>Healthy Treats Your Cat Will Love</Text>
            </View>
          </TouchableOpacity>
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
  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 10,
  },
  seeAllText: {
    color: '#FF8BA7',
    fontSize: 15,
    fontWeight: '700',
  },
  carouselContainer: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 10,
  },
  carouselCard: {
    width: width * 0.75,
    height: 160,
    borderRadius: 32,
    padding: 20,
    marginRight: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  carouselPetName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 2,
  },
  carouselPetBreed: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  ageBadge: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  manageBtnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  manageBtnTextMinimal: {
    color: '#FF8BA7',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 2,
  },
  carouselPetImage: {
    position: 'absolute',
    right: -25,
    bottom: -20,
    width: 170,
    height: 170,
    zIndex: 1,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  scheduleSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  scheduleTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTimeText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
  },
  dailyLogBtn: {
    backgroundColor: '#38BDF8',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dailyLogBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyLogBtnTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  dailyLogBtnDesc: {
    color: '#E0F2FE',
    fontSize: 13,
    fontWeight: '500',
  },
  tipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  tipCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  tipImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E2E8F0',
  },
  tipContent: {
    padding: 12,
  },
  tipCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF8BA7',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
  },
});

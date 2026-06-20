import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Meal {
  time: string;
  type: string;
}

export interface FoodBaseline {
  foodType: string; // Packaged, Homemade, Mixed, Vet-Prescribed
  details: string; // Brand names or ingredients
  avgQuantity: string; // e.g., 2 bowls/day
  waterIntake: string; // e.g., 1 liter/day
}

export interface DailyLog {
  id: string;
  petId: string;
  date: string; // ISO string
  foodIntake: string; // Ate everything, Ate most of it, Ate half, Ate very little, Did not eat
  timing: string; // Usual time, Slightly delayed, Missed meal
  waterIntake: string; // Normal, Increased, Reduced
  symptoms: string[]; 
  aiObservation?: string; // Stored AI result
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  image: any;
  bg: string;
  wakeTime?: string;
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
  walkTimes?: string[];
  foodBaseline?: FoodBaseline;
}

interface PetStore {
  ownerName: string;
  pets: Pet[];
  dailyLogs: DailyLog[];
  hasCompletedOnboarding: boolean;
  setOwnerName: (name: string) => void;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  addDailyLog: (log: DailyLog) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      ownerName: '',
      pets: [],
      dailyLogs: [],
      hasCompletedOnboarding: false,
      setOwnerName: (name) => set({ ownerName: name }),
      addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
      updatePet: (id, updates) => set((state) => ({
        pets: state.pets.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      addDailyLog: (log) => set((state) => ({
        dailyLogs: [log, ...state.dailyLogs]
      })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      reset: () => set({ ownerName: '', pets: [], dailyLogs: [], hasCompletedOnboarding: false })
    }),
    {
      name: 'pawbuddy-pet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

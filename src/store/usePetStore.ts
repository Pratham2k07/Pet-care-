import { create } from 'zustand';

export interface Meal {
  time: string;
  type: string;
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
}

interface PetStore {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
}

export const usePetStore = create<PetStore>((set) => ({
  pets: [
    // We will keep one default pet so the screen isn't entirely empty if they skip
    { 
      id: 'default-1', 
      name: 'Bella', 
      type: 'Dog',
      breed: 'Shih Tzu', 
      age: '2 yrs', 
      weight: '5 kg',
      image: require('../../assets/theme1.png'), 
      bg: '#FFE9F0' 
    }
  ],
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  updatePet: (id, updates) => set((state) => ({
    pets: state.pets.map(p => p.id === id ? { ...p, ...updates } : p)
  }))
}));

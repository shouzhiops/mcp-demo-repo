import { create } from 'zustand';
import { getFacilities, getHouses, getPopulation } from '../utils/mockData';
import { FacilityData, HouseData, PopulationData } from '../types';

interface AppState {
  houses: HouseData[];
  population: PopulationData[];
  facilities: FacilityData[];
  refreshData: () => void;
  updateFacilityStatus: (id: string, status: FacilityData['status']) => void;
}

export const useStore = create<AppState>((set) => ({
  houses: getHouses(),
  population: getPopulation(),
  facilities: getFacilities(),
  
  refreshData: () => {
    // In a real app, this would fetch from an API
    set({
      houses: getHouses(),
      population: getPopulation(),
      facilities: getFacilities(),
    });
  },

  updateFacilityStatus: (id, status) => {
    set((state) => ({
      facilities: state.facilities.map((f) => 
        f.id === id ? { ...f, status } : f
      )
    }));
  }
}));

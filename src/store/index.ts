import { create } from 'zustand';
import { getFacilities, getHouses, getPopulation } from '../utils/mockData';
import { FacilityData, HouseData, PopulationData, Incident } from '../types';

const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: '路灯损坏',
    desc: '村口主干道路灯不亮，影响夜间出行安全',
    status: '待处理',
    reporter: '张建国',
    assignedTo: '王电工',
    createTime: '2023-10-01T08:30:00Z'
  },
  {
    id: 'INC-002',
    title: '水管破裂',
    desc: '二组村民家门口自来水管破裂，大量漏水',
    status: '处理中',
    reporter: '李明',
    assignedTo: '赵水管',
    createTime: '2023-10-02T14:20:00Z'
  },
  {
    id: 'INC-003',
    title: '邻里纠纷',
    desc: '三组两户村民因宅基地边界问题发生口角',
    status: '已结案',
    reporter: '王秀英',
    assignedTo: '李村长',
    createTime: '2023-09-28T10:15:00Z'
  }
];

interface AppState {
  houses: HouseData[];
  population: PopulationData[];
  facilities: FacilityData[];
  incidents: Incident[];
  
  refreshData: () => void;
  
  // Incident actions
  addIncident: (incident: Omit<Incident, 'id' | 'createTime'>) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  updateIncident: (id: string, data: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  // Facility actions
  updateFacilityStatus: (id: string, status: FacilityData['status']) => void;
  updateFacility: (id: string, data: Partial<FacilityData>) => void;

  // House actions
  updateHouse: (id: string, data: Partial<HouseData>) => void;

  // Population actions
  updatePopulation: (idCard: string, data: Partial<PopulationData>) => void;
}

export const useStore = create<AppState>((set) => ({
  houses: getHouses(),
  population: getPopulation(),
  facilities: getFacilities(),
  incidents: mockIncidents,
  
  refreshData: () => {
    // In a real app, this would fetch from an API
    set({
      houses: getHouses(),
      population: getPopulation(),
      facilities: getFacilities(),
      // incidents are mock data, optionally we could reset them here
    });
  },

  // Incident methods
  addIncident: (incidentData) => {
    set((state) => ({
      incidents: [
        {
          ...incidentData,
          id: `INC-${Date.now()}`,
          createTime: new Date().toISOString()
        },
        ...state.incidents
      ]
    }));
  },
  
  updateIncidentStatus: (id, status) => {
    set((state) => ({
      incidents: state.incidents.map((inc) => 
        inc.id === id ? { ...inc, status } : inc
      )
    }));
  },

  updateIncident: (id, data) => {
    set((state) => ({
      incidents: state.incidents.map((inc) => 
        inc.id === id ? { ...inc, ...data } : inc
      )
    }));
  },

  deleteIncident: (id) => {
    set((state) => ({
      incidents: state.incidents.filter((inc) => inc.id !== id)
    }));
  },

  // Facility methods
  updateFacilityStatus: (id, status) => {
    set((state) => ({
      facilities: state.facilities.map((f) => 
        f.id === id ? { ...f, status } : f
      )
    }));
  },

  updateFacility: (id, data) => {
    set((state) => ({
      facilities: state.facilities.map((f) => 
        f.id === id ? { ...f, ...data } : f
      )
    }));
  },

  // House methods
  updateHouse: (id, data) => {
    set((state) => ({
      houses: state.houses.map((h) => 
        h.id === id ? { ...h, ...data } : h
      )
    }));
  },

  // Population methods
  updatePopulation: (idCard, data) => {
    set((state) => ({
      population: state.population.map((p) => 
        p.idCard === idCard ? { ...p, ...data } : p
      )
    }));
  }
}));

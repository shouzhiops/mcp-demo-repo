import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api';

export interface Order {
  id: number;
  type: string;
  status: '待分拨' | '待处置' | '已处置' | '已销账';
  addressId: string;
  source?: string;
  priority?: string;
  handlerId?: number;
  description?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  address?: Address;
}

export interface Address {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  level?: string;
  type?: string;
  orders?: Order[];
  populations?: Population[];
  houses?: House[];
}

export interface Population {
  id: number;
  name: string;
  type: string;
  phone?: string;
  idCard?: string;
  gender?: string;
  addressId: string;
  address?: Address;
}

export interface House {
  id: number;
  status: string;
  usage?: string;
  ownerName?: string;
  ownerPhone?: string;
  addressId: string;
  address?: Address;
}

export interface Unit {
  id: number;
  name: string;
  type?: string;
  legalPerson?: string;
  contactPhone?: string;
  addressId: string;
  address?: Address;
}

export interface Facility {
  id: number;
  type: string;
  name?: string;
  status?: string;
  manager?: string;
  addressId: string;
  address?: Address;
}

export interface DisputeRecord {
  id: number;
  title?: string;
  content?: string;
  status?: string;
  addressId?: string;
  address?: Address;
}

export interface Project {
  id: number;
  name?: string;
  status?: string;
  addressId?: string;
  address?: Address;
}

export interface FloatingRecord {
  id: number;
  name?: string;
  reason?: string;
  addressId?: string;
  address?: Address;
}

export interface HouseInspection {
  id: number;
  inspector?: string;
  result?: string;
  addressId?: string;
  address?: Address;
}

export interface SupervisionTask {
  id: number;
  title?: string;
  status?: string;
  addressId?: string;
  address?: Address;
}

interface StoreState {
  orders: Order[];
  addresses: Address[];
  populations: Population[];
  houses: House[];
  units: Unit[];
  facilities: Facility[];
  disputeRecords: DisputeRecord[];
  projects: Project[];
  floatingRecords: FloatingRecord[];
  houseInspections: HouseInspection[];
  supervisionTasks: SupervisionTask[];
  loading: boolean;
  
  fetchAddresses: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchPopulations: () => Promise<void>;
  fetchHouses: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchFacilities: () => Promise<void>;
  fetchDisputeRecords: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchFloatingRecords: () => Promise<void>;
  fetchHouseInspections: () => Promise<void>;
  fetchSupervisionTasks: () => Promise<void>;
  
  updateOrderStatus: (id: number, status: Order['status'], handlerId?: number) => Promise<void>;
  
  // CRUD - Address
  addAddress: (data: Partial<Address>) => Promise<void>;
  updateAddress: (id: string, data: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  // CRUD - Population
  addPopulation: (data: Partial<Population>) => Promise<void>;
  updatePopulation: (id: number, data: Partial<Population>) => Promise<void>;
  deletePopulation: (id: number) => Promise<void>;
  // CRUD - House
  addHouse: (data: Partial<House>) => Promise<void>;
  updateHouse: (id: number, data: Partial<House>) => Promise<void>;
  deleteHouse: (id: number) => Promise<void>;
  // CRUD - Unit
  addUnit: (data: Partial<Unit>) => Promise<void>;
  updateUnit: (id: number, data: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: number) => Promise<void>;
  // CRUD - Facility
  addFacility: (data: Partial<Facility>) => Promise<void>;
  updateFacility: (id: number, data: Partial<Facility>) => Promise<void>;
  deleteFacility: (id: number) => Promise<void>;
  // CRUD - Order
  addOrder: (data: Partial<Order>) => Promise<void>;
  updateOrderFull: (id: number, data: Partial<Order>) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;

  // CRUD - DisputeRecord
  addDisputeRecord: (data: Partial<DisputeRecord>) => Promise<void>;
  updateDisputeRecord: (id: number, data: Partial<DisputeRecord>) => Promise<void>;
  deleteDisputeRecord: (id: number) => Promise<void>;
  // CRUD - Project
  addProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: number, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  // CRUD - FloatingRecord
  addFloatingRecord: (data: Partial<FloatingRecord>) => Promise<void>;
  updateFloatingRecord: (id: number, data: Partial<FloatingRecord>) => Promise<void>;
  deleteFloatingRecord: (id: number) => Promise<void>;
  // CRUD - HouseInspection
  addHouseInspection: (data: Partial<HouseInspection>) => Promise<void>;
  updateHouseInspection: (id: number, data: Partial<HouseInspection>) => Promise<void>;
  deleteHouseInspection: (id: number) => Promise<void>;
  // CRUD - SupervisionTask
  addSupervisionTask: (data: Partial<SupervisionTask>) => Promise<void>;
  updateSupervisionTask: (id: number, data: Partial<SupervisionTask>) => Promise<void>;
  deleteSupervisionTask: (id: number) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  orders: [],
  addresses: [],
  populations: [],
  houses: [],
  units: [],
  facilities: [],
  disputeRecords: [],
  projects: [],
  floatingRecords: [],
  houseInspections: [],
  supervisionTasks: [],
  loading: false,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/addresses`);
      set({ addresses: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching addresses:', error);
      set({ loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/orders`);
      set({ orders: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ loading: false });
    }
  },

  fetchPopulations: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/populations`);
      set({ populations: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching populations:', error);
      set({ loading: false });
    }
  },

  fetchHouses: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/houses`);
      set({ houses: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching houses:', error);
      set({ loading: false });
    }
  },

  fetchUnits: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/units`);
      set({ units: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching units:', error);
      set({ loading: false });
    }
  },

  fetchFacilities: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/facilities`);
      set({ facilities: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching facilities:', error);
      set({ loading: false });
    }
  },

  fetchDisputeRecords: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/disputeRecords`);
      set({ disputeRecords: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching disputeRecords:', error);
      set({ loading: false });
    }
  },

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/projects`);
      set({ projects: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ loading: false });
    }
  },

  fetchFloatingRecords: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/floatingRecords`);
      set({ floatingRecords: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching floatingRecords:', error);
      set({ loading: false });
    }
  },

  fetchHouseInspections: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/houseInspections`);
      set({ houseInspections: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching houseInspections:', error);
      set({ loading: false });
    }
  },

  fetchSupervisionTasks: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/supervisionTasks`);
      set({ supervisionTasks: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching supervisionTasks:', error);
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id, status, handlerId) => {
    try {
      await axios.patch(`${API_URL}/orders/${id}`, { status, handlerId });
      get().fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  },

  // Address CRUD
  addAddress: async (data) => { await axios.post(`${API_URL}/addresses`, data); get().fetchAddresses(); },
  updateAddress: async (id, data) => { await axios.put(`${API_URL}/addresses/${id}`, data); get().fetchAddresses(); },
  deleteAddress: async (id) => { await axios.delete(`${API_URL}/addresses/${id}`); get().fetchAddresses(); },

  // Population CRUD
  addPopulation: async (data) => { await axios.post(`${API_URL}/populations`, data); get().fetchPopulations(); },
  updatePopulation: async (id, data) => { await axios.put(`${API_URL}/populations/${id}`, data); get().fetchPopulations(); },
  deletePopulation: async (id) => { await axios.delete(`${API_URL}/populations/${id}`); get().fetchPopulations(); },

  // House CRUD
  addHouse: async (data) => { await axios.post(`${API_URL}/houses`, data); get().fetchHouses(); },
  updateHouse: async (id, data) => { await axios.put(`${API_URL}/houses/${id}`, data); get().fetchHouses(); },
  deleteHouse: async (id) => { await axios.delete(`${API_URL}/houses/${id}`); get().fetchHouses(); },

  // Unit CRUD
  addUnit: async (data) => { await axios.post(`${API_URL}/units`, data); get().fetchUnits(); },
  updateUnit: async (id, data) => { await axios.put(`${API_URL}/units/${id}`, data); get().fetchUnits(); },
  deleteUnit: async (id) => { await axios.delete(`${API_URL}/units/${id}`); get().fetchUnits(); },

  // Facility CRUD
  addFacility: async (data) => { await axios.post(`${API_URL}/facilities`, data); get().fetchFacilities(); },
  updateFacility: async (id, data) => { await axios.put(`${API_URL}/facilities/${id}`, data); get().fetchFacilities(); },
  deleteFacility: async (id) => { await axios.delete(`${API_URL}/facilities/${id}`); get().fetchFacilities(); },

  // Order CRUD
  addOrder: async (data) => { await axios.post(`${API_URL}/orders`, data); get().fetchOrders(); },
  updateOrderFull: async (id, data) => { await axios.put(`${API_URL}/orders/${id}`, data); get().fetchOrders(); },
  deleteOrder: async (id) => { await axios.delete(`${API_URL}/orders/${id}`); get().fetchOrders(); },

  // DisputeRecord CRUD
  addDisputeRecord: async (data) => { await axios.post(`${API_URL}/disputeRecords`, data); get().fetchDisputeRecords(); },
  updateDisputeRecord: async (id, data) => { await axios.put(`${API_URL}/disputeRecords/${id}`, data); get().fetchDisputeRecords(); },
  deleteDisputeRecord: async (id) => { await axios.delete(`${API_URL}/disputeRecords/${id}`); get().fetchDisputeRecords(); },

  // Project CRUD
  addProject: async (data) => { await axios.post(`${API_URL}/projects`, data); get().fetchProjects(); },
  updateProject: async (id, data) => { await axios.put(`${API_URL}/projects/${id}`, data); get().fetchProjects(); },
  deleteProject: async (id) => { await axios.delete(`${API_URL}/projects/${id}`); get().fetchProjects(); },

  // FloatingRecord CRUD
  addFloatingRecord: async (data) => { await axios.post(`${API_URL}/floatingRecords`, data); get().fetchFloatingRecords(); },
  updateFloatingRecord: async (id, data) => { await axios.put(`${API_URL}/floatingRecords/${id}`, data); get().fetchFloatingRecords(); },
  deleteFloatingRecord: async (id) => { await axios.delete(`${API_URL}/floatingRecords/${id}`); get().fetchFloatingRecords(); },

  // HouseInspection CRUD
  addHouseInspection: async (data) => { await axios.post(`${API_URL}/houseInspections`, data); get().fetchHouseInspections(); },
  updateHouseInspection: async (id, data) => { await axios.put(`${API_URL}/houseInspections/${id}`, data); get().fetchHouseInspections(); },
  deleteHouseInspection: async (id) => { await axios.delete(`${API_URL}/houseInspections/${id}`); get().fetchHouseInspections(); },

  // SupervisionTask CRUD
  addSupervisionTask: async (data) => { await axios.post(`${API_URL}/supervisionTasks`, data); get().fetchSupervisionTasks(); },
  updateSupervisionTask: async (id, data) => { await axios.put(`${API_URL}/supervisionTasks/${id}`, data); get().fetchSupervisionTasks(); },
  deleteSupervisionTask: async (id) => { await axios.delete(`${API_URL}/supervisionTasks/${id}`); get().fetchSupervisionTasks(); },

}));

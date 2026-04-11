import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Order {
  id: number;
  type: string;
  status: '待分拨' | '待处置' | '已处置' | '已销账';
  addressId: string;
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
  orders?: Order[];
}

export interface Population {
  id: number;
  name: string;
  type: string;
  phone: string;
  addressId: string;
  address?: Address;
}

export interface House {
  id: number;
  status: string;
  addressId: string;
  address?: Address;
}

export interface Unit {
  id: number;
  name: string;
  addressId: string;
  address?: Address;
}

export interface Facility {
  id: number;
  type: string;
  addressId: string;
  address?: Address;
}

export interface Config {
  id: number;
  tiandituKey: string | null;
}

interface StoreState {
  orders: Order[];
  addresses: Address[];
  populations: Population[];
  houses: House[];
  units: Unit[];
  facilities: Facility[];
  config: Config | null;
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchPopulations: () => Promise<void>;
  fetchHouses: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchFacilities: () => Promise<void>;
  fetchConfig: () => Promise<void>;
  updateConfig: (tiandituKey: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'address'>) => Promise<void>;
  updateOrderStatus: (id: number, status: Order['status'], handlerId?: number) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  orders: [],
  addresses: [],
  populations: [],
  houses: [],
  units: [],
  facilities: [],
  config: null,
  loading: false,
  
  fetchConfig: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/config`);
      set({ config: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching config:', error);
      set({ loading: false });
    }
  },

  updateConfig: async (tiandituKey: string) => {
    try {
      const response = await axios.patch(`${API_URL}/config`, { tiandituKey });
      set({ config: response.data });
    } catch (error) {
      console.error('Error updating config:', error);
      throw error;
    }
  },

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

  addOrder: async (order) => {
    try {
      await axios.post(`${API_URL}/orders`, order);
      // Fetch latest orders after adding
      const response = await axios.get(`${API_URL}/orders`);
      set({ orders: response.data });
    } catch (error) {
      console.error('Error adding order:', error);
    }
  },

  updateOrderStatus: async (id, status, handlerId) => {
    try {
      await axios.patch(`${API_URL}/orders/${id}`, { status, handlerId });
      // Fetch latest orders after updating
      const response = await axios.get(`${API_URL}/orders`);
      set({ orders: response.data });
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }
}));

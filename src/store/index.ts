import { create } from 'zustand';
import axios from 'axios';


const API_URL = '/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // We don't want to reload if we are already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);



export interface User {
  id: number;
  username: string;
  name?: string;
  status?: string;
  roleId: number;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions?: string;
}

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

interface StoreState {

  token: string | null;
  currentUser: User | null;
  users: User[];
  roles: Role[];
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  orders: Order[];

  addresses: Address[];
  populations: Population[];
  houses: House[];
  units: Unit[];
  facilities: Facility[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchPopulations: () => Promise<void>;
  fetchHouses: () => Promise<void>;
  fetchUnits: () => Promise<void>;
  fetchFacilities: () => Promise<void>;
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
  
  // CRUD - User
  addUser: (data: Partial<User>) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  // CRUD - Role
  addRole: (data: Partial<Role>) => Promise<void>;
  updateRole: (id: number, data: Partial<Role>) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({

  token: localStorage.getItem('token') || null,
  currentUser: null,
  users: [],
  roles: [],
  
  login: async (credentials) => {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    set({ token, currentUser: user });
  },

  register: async (credentials) => {
    const res = await axios.post(`${API_URL}/auth/register`, credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    set({ token, currentUser: user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, currentUser: null });
  },

  fetchUsers: async () => {
    const res = await axios.get(`${API_URL}/users`);
    set({ users: res.data });
  },

  fetchRoles: async () => {
    const res = await axios.get(`${API_URL}/roles`);
    set({ roles: res.data });
  },

  orders: [],

  addresses: [],
  populations: [],
  houses: [],
  units: [],
  facilities: [],
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

  // User CRUD
  addUser: async (data) => { await axios.post(`${API_URL}/users`, data); get().fetchUsers(); },
  updateUser: async (id, data) => { await axios.put(`${API_URL}/users/${id}`, data); get().fetchUsers(); },
  deleteUser: async (id) => { await axios.delete(`${API_URL}/users/${id}`); get().fetchUsers(); },

  // Role CRUD
  addRole: async (data) => { await axios.post(`${API_URL}/roles`, data); get().fetchRoles(); },
  updateRole: async (id, data) => { await axios.put(`${API_URL}/roles/${id}`, data); get().fetchRoles(); },
  deleteRole: async (id) => { await axios.delete(`${API_URL}/roles/${id}`); get().fetchRoles(); },

}));

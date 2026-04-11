import { create } from 'zustand';

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
}

export interface Address {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
}

interface StoreState {
  orders: Order[];
  addresses: Address[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: number, status: Order['status'], handlerId?: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  orders: [
    {
      id: 1,
      type: '危房裂缝',
      status: '待分拨',
      addressId: '新华村-1组-001号',
      description: '房屋后墙出现明显裂缝',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: '防溺水牌倾倒',
      status: '待处置',
      addressId: '新华村-2组-002号',
      handlerId: 101,
      description: '水库边的防溺水警示牌被风刮倒',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  addresses: [
    { id: '新华村-1组-001号', name: '张三家', longitude: 116.4, latitude: 39.9 },
    { id: '新华村-2组-002号', name: '村口水库', longitude: 116.41, latitude: 39.91 },
    { id: '新华村-3组-015号', name: '李四家', longitude: 116.42, latitude: 39.92 },
  ],
  addOrder: (order) => set((state) => ({
    orders: [
      ...state.orders,
      {
        ...order,
        id: state.orders.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  })),
  updateOrderStatus: (id, status, handlerId) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === id 
        ? { ...order, status, handlerId: handlerId ?? order.handlerId, updatedAt: new Date().toISOString() }
        : order
    )
  }))
}));

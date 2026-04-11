import React from 'react';
import { useStore } from '../../../store';

interface RightPanelProps {
  onOrderSelect: (orderId: number | null) => void;
  selectedOrderId: number | null;
}

export default function RightPanel({ onOrderSelect, selectedOrderId }: RightPanelProps) {
  const { orders } = useStore();

  const activeOrders = orders.filter(o => o.status !== '已销账');

  return (
    <div className="absolute right-8 top-32 w-[400px] h-[calc(1080px-160px)] z-10 pointer-events-none flex flex-col">
      <div className="flex-1 bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 flex flex-col shadow-2xl pointer-events-auto overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-red-900/40 to-transparent">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            实时异常预警
            <span className="ml-auto bg-red-500/20 text-red-400 text-sm py-1 px-3 rounded-full border border-red-500/30">
              {activeOrders.length} 起
            </span>
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="text-4xl mb-2">✨</div>
              <div>当前网格内无异常预警</div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => onOrderSelect(selectedOrderId === order.id ? null : order.id)}
                  className={`
                    p-4 rounded-lg border transition-all cursor-pointer
                    ${selectedOrderId === order.id 
                      ? 'bg-blue-900/40 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-red-400 font-bold">{order.type}</span>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      order.status === '待分拨' 
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">{order.description}</div>
                  <div className="text-xs text-gray-500 flex justify-between items-center pt-2 border-t border-slate-700/50 mt-2">
                    <span className="truncate max-w-[180px]" title={order.addressId}>📍 {order.addressId}</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
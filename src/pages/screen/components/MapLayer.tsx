import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../../../store';

// 图标单例，避免重复创建
const normalIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const alertIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex h-6 w-6">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.9)]"></span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

interface MapLayerProps {
  selectedOrderId: number | null;
}

// 内部组件：负责控制地图交互行为
function MapController({ selectedOrderId }: { selectedOrderId: number | null }) {
  const map = useMap();
  const { addresses, orders } = useStore();
  const initialFitDone = useRef(false);

  // 1. 初始化时自动计算边界居中
  useEffect(() => {
    if (addresses.length > 0 && !initialFitDone.current) {
      const bounds = L.latLngBounds(addresses.map(a => [a.latitude, a.longitude]));
      // padding 留出左右面板的空间
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
      initialFitDone.current = true;
    }
  }, [addresses, map]);

  // 2. 监听工单选中事件，平滑飞行定位
  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find(o => o.id === selectedOrderId);
      if (order) {
        const address = addresses.find(a => a.id === order.addressId);
        if (address) {
          map.flyTo([address.latitude, address.longitude], 18, {
            duration: 1.5
          });
        }
      }
    }
  }, [selectedOrderId, orders, addresses, map]);

  return null;
}

export default function MapLayer({ selectedOrderId }: MapLayerProps) {
  const { config, addresses, orders } = useStore();
  const activeOrders = orders.filter(o => o.status !== '已销账');

  // 如果没有配置 key，理论上 ScreenApp 会拦截，但为了安全起见这里也加个防御
  if (!config?.tiandituKey) return null;

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={[23.85, 113.89]} // 初始默认中心，很快会被 MapController 的 fitBounds 覆盖
        zoom={16} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapController selectedOrderId={selectedOrderId} />
        
        {/* 天地图影像底图 */}
        <TileLayer
          url={`http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${config.tiandituKey}`}
          maxZoom={18}
        />
        {/* 天地图影像注记 */}
        <TileLayer
          url={`http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${config.tiandituKey}`}
          maxZoom={18}
        />

        {addresses.map((address) => {
          const hasAlert = activeOrders.some(o => o.addressId === address.id);
          const isSelected = selectedOrderId && activeOrders.find(o => o.id === selectedOrderId)?.addressId === address.id;
          
          return (
            <Marker 
              key={address.id} 
              position={[address.latitude, address.longitude]}
              icon={hasAlert ? alertIcon : normalIcon}
            >
              <Popup className="custom-popup" autoPan={false}>
                <div className="font-bold text-gray-800 text-lg mb-1">{address.name}</div>
                <div className="text-xs text-gray-500 mb-2 border-b pb-2">{address.id}</div>
                
                {/* 详情展示 */}
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">关联人口:</span>
                    <span className="font-medium text-blue-600">{address.populations?.length || 0} 人</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">房屋属性:</span>
                    <span className="font-medium text-blue-600">{address.houses?.[0]?.status || '暂无'}</span>
                  </div>
                </div>

                {hasAlert && (
                  <div className="mt-3 bg-red-50 p-2 rounded border border-red-200">
                    <div className="text-red-600 font-bold text-sm mb-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      待处理预警
                    </div>
                    <ul className="text-xs text-red-500 list-disc pl-4 space-y-1">
                      {activeOrders.filter(o => o.addressId === address.id).map(o => (
                        <li key={o.id}>{o.type} ({o.status})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactECharts from 'echarts-for-react';
import { useStore } from '../../store';

const createIcon = (hasAlert: boolean) => {
  return L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
      hasAlert ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
    }">
      ${hasAlert ? '<div class="absolute w-8 h-8 bg-red-500/30 rounded-full animate-ping"></div>' : ''}
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const ScreenApp: React.FC = () => {
  const { addresses, orders, fetchAddresses, fetchOrders } = useStore();

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== '已销账');
  }, [orders]);

  const activeAddressIds = useMemo(() => {
    return new Set(activeOrders.map(o => o.addressId));
  }, [activeOrders]);

  const genderOption = {
    backgroundColor: 'transparent',
    title: { 
      text: '人口男女比例', 
      textStyle: { color: '#e2e8f0', fontSize: 16, fontWeight: 'normal' },
      left: 'center',
      top: 10
    },
    tooltip: { trigger: 'item', backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', textStyle: { color: '#f8fafc' } },
    legend: { bottom: 10, textStyle: { color: '#94a3b8' } },
    series: [
      {
        name: '性别比例',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#1e293b',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#f8fafc' }
        },
        labelLine: { show: false },
        data: [
          { value: 1048, name: '男', itemStyle: { color: '#3b82f6' } },
          { value: 985, name: '女', itemStyle: { color: '#ec4899' } }
        ]
      }
    ]
  };

  const workOption = {
    backgroundColor: 'transparent',
    title: { 
      text: '村民外出务工统计', 
      textStyle: { color: '#e2e8f0', fontSize: 16, fontWeight: 'normal' },
      left: 'center',
      top: 10
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', textStyle: { color: '#f8fafc' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '25%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        data: ['本省', '外省', '本市', '外市', '乡内'],
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#94a3b8' },
        axisLine: { lineStyle: { color: '#334155' } }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
      }
    ],
    series: [
      {
        name: '人数',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#60a5fa' },
              { offset: 1, color: '#2563eb' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        data: [320, 280, 450, 190, 600]
      }
    ]
  };

  return (
    <div className="w-screen h-screen relative bg-slate-950 overflow-hidden text-slate-200">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[23.85, 113.89]} 
          zoom={16} 
          style={{ height: '100%', width: '100%', background: '#020617' }}
          zoomControl={false}
        >
          {/* Dark theme tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {addresses.map(addr => {
            const hasAlert = activeAddressIds.has(addr.id);
            return (
              <Marker 
                key={addr.id} 
                position={[addr.latitude, addr.longitude]}
                icon={createIcon(hasAlert)}
              >
                <Popup className="custom-popup">
                  <div className="text-slate-800 p-1 min-w-[150px]">
                    <h3 className="font-bold text-base border-b border-slate-200 pb-2 mb-2">{addr.name}</h3>
                    <p className="text-sm text-slate-600 mb-1"><span className="font-semibold">编号:</span> {addr.id}</p>
                    {hasAlert ? (
                      <div className="mt-3 flex items-center gap-1 text-red-600 font-semibold text-sm bg-red-50 p-2 rounded border border-red-200">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        有未处理异常工单
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-1 text-green-600 font-semibold text-sm bg-green-50 p-2 rounded border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        状态正常
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950/90 via-slate-900/50 to-transparent z-10 flex items-start justify-center pt-6 pointer-events-none">
        <h1 className="text-4xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          农村一标四实系统 - 可视化指挥大屏
        </h1>
      </div>

      {/* Left Panel */}
      <div className="absolute top-28 left-6 bottom-8 w-[400px] z-10 flex flex-col gap-6">
        <div className="flex-1 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
          <ReactECharts option={genderOption} style={{ height: '100%', width: '100%' }} />
        </div>
        <div className="flex-1 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
          <ReactECharts option={workOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="absolute top-28 right-6 bottom-8 w-[400px] bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 z-10 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            实时异常预警
          </h2>
          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {activeOrders.length} 项待处理
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          {activeOrders.map(order => (
            <div key={order.id} className="bg-slate-800/60 border border-slate-600/50 rounded-xl p-4 hover:bg-slate-700/60 hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md text-xs font-semibold border border-red-500/20">
                    {order.type}
                  </span>
                  <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md text-xs font-semibold border border-amber-500/20">
                    {order.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="mb-2 flex items-start gap-2 text-sm text-slate-300">
                <svg className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-slate-200">{order.addressId}</span>
              </div>
              
              <div className="text-sm text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/50 group-hover:border-slate-600/50 transition-colors">
                {order.description || '无详细描述'}
              </div>
            </div>
          ))}
          
          {activeOrders.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 mt-10">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm">当前暂无异常预警工单</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenApp;

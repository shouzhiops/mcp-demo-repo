import React from 'react';
import { useStore } from '../../../store';

export default function HeaderPanel() {
  const { populations, houses, units, orders } = useStore();

  const totalPopulations = populations.length;
  const totalHouses = houses.length;
  const totalUnits = units.length;
  const pendingOrders = orders.filter(o => o.status === '待分拨' || o.status === '待处置').length;

  return (
    <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
      {/* 顶部主标题 */}
      <div className="flex justify-center mt-6">
        <div className="px-16 py-4 bg-gray-900/60 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            莲麻村一标四实指挥中枢
          </h1>
        </div>
      </div>

      {/* 核心指标 KPI 容器 */}
      <div className="flex justify-center mt-6 gap-8 pointer-events-auto">
        <KpiCard title="实有人口总数" value={totalPopulations} unit="人" />
        <KpiCard title="实有房屋总数" value={totalHouses} unit="栋" />
        <KpiCard title="实有单位总数" value={totalUnits} unit="家" />
        <KpiCard title="当前未处置隐患" value={pendingOrders} unit="起" isAlert={pendingOrders > 0} />
      </div>
    </div>
  );
}

function KpiCard({ title, value, unit, isAlert = false }: { title: string, value: number, unit: string, isAlert?: boolean }) {
  return (
    <div className={`
      px-8 py-4 rounded-lg backdrop-blur-md border 
      ${isAlert 
        ? 'bg-red-900/40 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
        : 'bg-slate-900/60 border-slate-700/50 shadow-lg'
      }
    `}>
      <div className="text-gray-400 text-sm mb-1 font-medium tracking-wider">{title}</div>
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold font-mono ${isAlert ? 'text-red-400' : 'text-cyan-400'}`}>
          {value}
        </span>
        <span className="text-gray-500 text-sm">{unit}</span>
      </div>
    </div>
  );
}

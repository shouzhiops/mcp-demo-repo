import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store';

export default function HeaderPanel() {
  const { populations, houses, units, orders } = useStore();
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const day = days[now.getDay()];
      
      setTimeStr(`${year}-${month}-${date} ${hours}:${minutes}:${seconds} ${day}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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

      {/* 左上角挂件区 */}
      <div className="absolute left-8 top-8 flex items-center gap-6 pointer-events-auto">
        {/* 后台跳转按钮 */}
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all transform hover:scale-105 border border-blue-400/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          数据后台
        </button>
      </div>

      {/* 右上角挂件区 */}
      <div className="absolute right-8 top-8 flex items-center gap-6 pointer-events-auto">
        {/* 时间与天气 */}
        <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-full shadow-lg">
          <div className="text-cyan-400 font-mono text-lg font-bold tracking-wider">
            {timeStr}
          </div>
          <div className="w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2 text-gray-300 font-medium">
            <span className="text-xl">🌤️</span>
            <span>多云 26°C</span>
          </div>
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

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useStore } from '../../../store';

export default function LeftPanel() {
  const { populations, houses, orders } = useStore();

  // 聚合人口数据
  const populationOption = useMemo(() => {
    const counts: Record<string, number> = {};
    populations.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });

    const data = Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));

    return {
      tooltip: { trigger: 'item' },
      legend: { top: '5%', left: 'center', textStyle: { color: '#cbd5e1', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
      series: [
        {
          name: '人口类型',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#0f172a',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#fff' }
          },
          labelLine: { show: false },
          data: data.length > 0 ? data : [{ name: '暂无数据', value: 0 }]
        }
      ]
    };
  }, [populations]);

  // 聚合房屋数据
  const houseOption = useMemo(() => {
    const counts: Record<string, number> = {};
    houses.forEach(h => {
      counts[h.status] = (counts[h.status] || 0) + 1;
    });

    const data = Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));

    data.sort((a, b) => b.value - a.value);

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: { 
        type: 'value',
        axisLabel: { color: '#94a3b8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      yAxis: { 
        type: 'category', 
        data: data.map(d => d.name),
        axisLabel: { color: '#cbd5e1', fontSize: 10 }
      },
      series: [
        {
          name: '房屋数量',
          type: 'bar',
          data: data.map(d => d.value),
          barWidth: '50%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#06b6d4' }]
            },
            borderRadius: [0, 4, 4, 0]
          }
        }
      ]
    };
  }, [houses]);

  // 聚合基层治理效能数据 (隐患化解率 + 高发类型)
  const governanceOption = useMemo(() => {
    const totalOrders = orders.length;
    const resolvedOrders = orders.filter(o => o.status === '已销账').length;
    const resolveRate = totalOrders === 0 ? 0 : Math.round((resolvedOrders / totalOrders) * 100);

    const typeCounts: Record<string, number> = {};
    orders.forEach(o => {
      typeCounts[o.type] = (typeCounts[o.type] || 0) + 1;
    });
    
    // 取 TOP 5
    const typeData = Object.keys(typeCounts)
      .map(key => ({ name: key, value: typeCounts[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .reverse(); // 为了让柱状图最高在上面

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: [
        // 给左侧留出给仪表盘的空间，柱状图放在右侧
        { left: '45%', right: '5%', bottom: '5%', top: '10%', containLabel: true }
      ],
      xAxis: { 
        type: 'value', show: false 
      },
      yAxis: { 
        type: 'category', 
        data: typeData.map(d => d.name),
        axisLabel: { color: '#cbd5e1', fontSize: 10, interval: 0 },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [
        // 隐患化解率仪表盘
        {
          type: 'gauge',
          center: ['20%', '50%'],
          radius: '80%',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          itemStyle: {
            color: '#10b981',
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          progress: { show: true, width: 10 },
          pointer: { show: false },
          axisLine: { lineStyle: { width: 10, color: [[1, '#334155']] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          title: { show: true, fontSize: 10, color: '#94a3b8', offsetCenter: [0, '40%'] },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            color: '#10b981',
            offsetCenter: [0, '0%'],
            formatter: '{value}%'
          },
          data: [{ value: resolveRate, name: '化解率' }]
        },
        // TOP 5 隐患类型柱状图
        {
          name: '发生次数',
          type: 'bar',
          data: typeData.map(d => d.value),
          barWidth: '40%',
          label: { show: true, position: 'right', color: '#fff', fontSize: 10 },
          itemStyle: {
            color: '#f59e0b',
            borderRadius: [0, 4, 4, 0]
          }
        }
      ]
    };
  }, [orders]);

  return (
    <div className="absolute left-8 top-32 w-[400px] h-[calc(1080px-160px)] z-10 flex flex-col gap-4 pointer-events-none">
      <div className="flex-[1] bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 flex flex-col shadow-2xl pointer-events-auto">
        <h3 className="text-lg font-bold text-white mb-2 border-l-4 border-cyan-400 pl-3">实有人口画像</h3>
        <div className="flex-1 min-h-0">
          <ReactECharts option={populationOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      <div className="flex-[1] bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 flex flex-col shadow-2xl pointer-events-auto">
        <h3 className="text-lg font-bold text-white mb-2 border-l-4 border-blue-400 pl-3">实有房屋状态</h3>
        <div className="flex-1 min-h-0">
          <ReactECharts option={houseOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      <div className="flex-[1] bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 flex flex-col shadow-2xl pointer-events-auto">
        <h3 className="text-lg font-bold text-white mb-2 border-l-4 border-emerald-400 pl-3">基层治理效能</h3>
        <div className="flex-1 min-h-0">
          <ReactECharts option={governanceOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
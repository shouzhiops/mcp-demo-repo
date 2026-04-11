import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useStore } from '../../../store';

export default function LeftPanel() {
  const { populations, houses } = useStore();

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
      legend: { top: '5%', left: 'center', textStyle: { color: '#cbd5e1' } },
      series: [
        {
          name: '人口类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#0f172a',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#fff' }
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

    // 根据数量降序排序
    data.sort((a, b) => b.value - a.value);

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { 
        type: 'value',
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      yAxis: { 
        type: 'category', 
        data: data.map(d => d.name),
        axisLabel: { color: '#cbd5e1' }
      },
      series: [
        {
          name: '房屋数量',
          type: 'bar',
          data: data.map(d => d.value),
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

  return (
    <div className="absolute left-8 top-32 w-[400px] h-[calc(1080px-160px)] z-10 flex flex-col gap-6 pointer-events-none">
      <div className="flex-1 bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 flex flex-col shadow-2xl pointer-events-auto">
        <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-cyan-400 pl-3">实有人口画像</h3>
        <div className="flex-1 min-h-0">
          <ReactECharts option={populationOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      <div className="flex-1 bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 flex flex-col shadow-2xl pointer-events-auto">
        <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-400 pl-3">实有房屋状态</h3>
        <div className="flex-1 min-h-0">
          <ReactECharts option={houseOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
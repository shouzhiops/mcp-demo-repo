import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useStore } from '../../../store';

interface RightPanelProps {
  onOrderSelect: (orderId: number | null) => void;
  selectedOrderId: number | null;
}

export default function RightPanel({ onOrderSelect, selectedOrderId }: RightPanelProps) {
  const { orders, units, facilities } = useStore();

  const activeOrders = orders.filter(o => o.status !== '已销账');

  // 聚合实有单位数据 (模糊分类)
  const unitOption = useMemo(() => {
    const categories = { '特色餐饮': 0, '农业合作': 0, '加工制造': 0, '便民服务': 0, '其他': 0 };
    units.forEach(u => {
      if (u.name.includes('农家乐') || u.name.includes('餐饮')) categories['特色餐饮']++;
      else if (u.name.includes('合作') || u.name.includes('农场')) categories['农业合作']++;
      else if (u.name.includes('酒') || u.name.includes('厂') || u.name.includes('加工')) categories['加工制造']++;
      else if (u.name.includes('站') || u.name.includes('点') || u.name.includes('中心')) categories['便民服务']++;
      else categories['其他']++;
    });

    const data = Object.keys(categories)
      .map(key => ({ name: key, value: categories[key as keyof typeof categories] }))
      .filter(d => d.value > 0);

    return {
      tooltip: { trigger: 'item' },
      legend: { top: '5%', left: 'center', textStyle: { color: '#cbd5e1', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
      series: [
        {
          name: '经济实体类型',
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
  }, [units]);

  // 聚合安防设施数据
  const facilityOption = useMemo(() => {
    const counts: Record<string, number> = {};
    facilities.forEach(f => {
      counts[f.type] = (counts[f.type] || 0) + 1;
    });

    const types = Object.keys(counts);
    const maxVal = Math.max(...Object.values(counts), 5); // 设定雷达图最大值

    return {
      tooltip: {},
      radar: {
        indicator: types.length > 0 
          ? types.map(t => ({ name: t, max: maxVal }))
          : [{ name: '暂无设施', max: 1 }],
        center: ['50%', '55%'],
        radius: '65%',
        axisName: { color: '#cbd5e1', fontSize: 10 },
        splitArea: {
          areaStyle: {
            color: ['rgba(30, 41, 59, 0.5)', 'rgba(15, 23, 42, 0.5)']
          }
        },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } }
      },
      series: [
        {
          name: '设施覆盖分布',
          type: 'radar',
          data: [
            {
              value: types.length > 0 ? types.map(t => counts[t]) : [0],
              name: '设施数量',
              areaStyle: { color: 'rgba(139, 92, 246, 0.4)' },
              lineStyle: { color: '#8b5cf6' },
              itemStyle: { color: '#8b5cf6' }
            }
          ]
        }
      ]
    };
  }, [facilities]);

  return (
    <div className="absolute right-8 top-32 w-[400px] h-[calc(1080px-160px)] z-10 pointer-events-none flex flex-col gap-4">
      {/* 1. 实有单位画像 */}
      <div className="flex-[1] bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 flex flex-col shadow-2xl pointer-events-auto">
        <h3 className="text-lg font-bold text-white mb-2 border-l-4 border-purple-400 pl-3">村级经济实体画像</h3>
        <div className="flex-1 min-h-0">
          <ReactECharts option={unitOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* 2. 安防设施覆盖 */}
      <div className="flex-[1] bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 flex flex-col shadow-2xl pointer-events-auto">
        <h3 className="text-lg font-bold text-white mb-2 border-l-4 border-indigo-400 pl-3">安防与公共设施覆盖</h3>
        <div className="flex-1 min-h-0">
          <ReactECharts option={facilityOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* 3. 实时异常预警列表 */}
      <div className="flex-[1.5] bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-700/50 flex flex-col shadow-2xl pointer-events-auto overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-red-900/40 to-transparent">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
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
              <div className="text-sm">当前网格内无异常预警</div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => onOrderSelect(selectedOrderId === order.id ? null : order.id)}
                  className={`
                    p-3 rounded-lg border transition-all cursor-pointer
                    ${selectedOrderId === order.id 
                      ? 'bg-blue-900/40 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-red-400 font-bold text-sm">{order.type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      order.status === '待分拨' 
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 mb-2 line-clamp-2">{order.description}</div>
                  <div className="text-[10px] text-gray-500 flex justify-between items-center pt-2 border-t border-slate-700/50">
                    <span className="truncate max-w-[160px]" title={order.addressId}>📍 {order.addressId}</span>
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
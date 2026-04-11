import { useStore } from '../store';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, Users, Home, Activity } from 'lucide-react';

export default function Dashboard() {
  const { houses, population, facilities } = useStore();

  const totalPopulation = population.length;
  const totalHouses = houses.length;
  
  const careList = population.filter(
    p => p.label === '独居老人' || p.label === '留守儿童' || p.label === '五保户'
  );
  
  const warningFacilities = facilities.filter(f => f.status !== '正常');

  const migrantWorkersByGroup = population
    .filter(p => p.label === '外出务工')
    .reduce((acc, curr) => {
      // Find the group from the house id, or simply use group from house if joined
      const house = houses.find(h => h.id === curr.houseId);
      const group = house?.group || '未知';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const residentCount = totalPopulation - population.filter(p => p.label === '外出务工').length;
  const migrantCount = population.filter(p => p.label === '外出务工').length;

  const barChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { 
      type: 'category', 
      data: Object.keys(migrantWorkersByGroup),
      axisLabel: { color: '#a0aec0' }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: '#a0aec0' },
      splitLine: { lineStyle: { color: '#2d3748' } }
    },
    series: [{
      data: Object.values(migrantWorkersByGroup),
      type: 'bar',
      itemStyle: {
        color: '#4fd1c5',
        borderRadius: [4, 4, 0, 0]
      }
    }]
  };

  const pieChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: { 
      top: 'bottom',
      textStyle: { color: '#a0aec0' }
    },
    series: [
      {
        name: '人口结构',
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#1a202c',
          borderWidth: 2
        },
        data: [
          { value: residentCount, name: '常住人口', itemStyle: { color: '#4299e1' } },
          { value: migrantCount, name: '外出务工', itemStyle: { color: '#ed8936' } }
        ]
      }
    ]
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">全村总房屋</p>
            <p className="text-4xl font-bold text-white font-mono">{totalHouses}</p>
          </div>
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Home className="text-blue-400 w-8 h-8" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">全村总人口</p>
            <p className="text-4xl font-bold text-white font-mono">{totalPopulation}</p>
          </div>
          <div className="p-3 bg-indigo-500/20 rounded-lg">
            <Users className="text-indigo-400 w-8 h-8" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">重点关怀人数</p>
            <p className="text-4xl font-bold text-orange-400 font-mono animate-pulse">{careList.length}</p>
          </div>
          <div className="p-3 bg-orange-500/20 rounded-lg">
            <Activity className="text-orange-400 w-8 h-8" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">需整改隐患</p>
            <p className="text-4xl font-bold text-red-400 font-mono">{warningFacilities.length}</p>
          </div>
          <div className="p-3 bg-red-500/20 rounded-lg">
            <AlertTriangle className="text-red-400 w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span>
            人口结构分析
          </h3>
          <div className="flex-1 min-h-0 relative">
            <ReactECharts option={pieChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <span className="w-1 h-4 bg-teal-500 rounded-full mr-2"></span>
            各组务工人数分布
          </h3>
          <div className="flex-1 min-h-0 relative">
            <ReactECharts option={barChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col overflow-hidden">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <span className="w-1 h-4 bg-red-500 rounded-full mr-2"></span>
            实时预警
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {warningFacilities.map(f => (
              <div key={f.id} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-200 font-medium">{f.name} <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded ml-2">{f.status}</span></p>
                  <p className="text-gray-400 text-sm mt-1">{f.issueDesc}</p>
                </div>
              </div>
            ))}
            {careList.map(p => (
              <div key={p.idCard} className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 flex items-start space-x-3">
                <Activity className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-200 font-medium">{p.name} <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded ml-2">{p.label}</span></p>
                  <p className="text-gray-400 text-sm mt-1">需安排本周网格员上门走访</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

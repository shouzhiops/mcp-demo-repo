import { useState } from 'react';
import { useStore } from '../store';
import { Search, MapPin, AlertCircle, Home as HomeIcon } from 'lucide-react';

export default function Ledger() {
  const { houses, population } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredHouses = houses.filter(h => {
    const matchSearch = h.id.includes(searchTerm) || h.owner.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide">以房管人台账</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索地址或户主..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all cursor-pointer hover:bg-gray-700"
          >
            <option value="all">所有状态</option>
            <option value="自住">自住</option>
            <option value="空置">空置</option>
            <option value="危房">危房</option>
            <option value="出租">出租</option>
            <option value="闲置">闲置</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-sm tracking-wider uppercase">
                <th className="p-4 font-medium">标准地址</th>
                <th className="p-4 font-medium">户主</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium w-1/2">居住人员详情</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredHouses.map((house, idx) => {
                const residents = population.filter(p => p.houseId === house.id);
                
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case '自住': return 'bg-green-500/20 text-green-400 border-green-500/30';
                    case '出租': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                    case '危房': return 'bg-red-500/20 text-red-400 border-red-500/30';
                    case '空置': 
                    case '闲置': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
                    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
                  }
                };

                const getPersonLabelColor = (label: string) => {
                  switch (label) {
                    case '常住村民': return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
                    case '外出务工': return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
                    case '独居老人':
                    case '留守儿童':
                    case '五保户': return 'bg-orange-500/10 text-orange-300 border-orange-500/20';
                    case '外来人口': return 'bg-teal-500/10 text-teal-300 border-teal-500/20';
                    default: return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
                  }
                };

                return (
                  <tr key={house.id} className={`hover:bg-gray-700/30 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-800/30'}`}>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <MapPin className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{house.id}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{house.group} · {house.structure} · {house.area}㎡</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 font-medium">{house.owner}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium border rounded-md ${getStatusColor(house.status)}`}>
                        {house.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {residents.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {residents.map(p => (
                            <div key={p.idCard} className={`flex items-center space-x-2 px-3 py-1.5 rounded border ${getPersonLabelColor(p.label)}`}>
                              <span className="font-medium">{p.name}</span>
                              <span className="text-[10px] opacity-70">({p.age}岁)</span>
                              <span className="text-xs opacity-90">{p.label}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500 text-sm italic">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          该房屋暂无常住人口记录
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredHouses.length === 0 && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <HomeIcon className="w-12 h-12 mb-4 opacity-50" />
              <p>未找到匹配的房屋信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

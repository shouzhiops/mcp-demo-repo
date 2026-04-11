import { useState } from 'react';
import { useStore } from '../store';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Inspection() {
  const { facilities, updateFacilityStatus } = useStore();
  const [filter, setFilter] = useState('all');

  const filteredFacilities = facilities.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'normal') return f.status === '正常';
    return f.status !== '正常';
  });

  const handleStatusUpdate = (id: string, newStatus: '正常' | '需整改' | '需清理') => {
    updateFacilityStatus(id, newStatus);
  };

  return (
    <div className="p-6 h-full flex flex-col max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide mb-1">掌上巡查管理</h2>
          <p className="text-gray-400 text-sm">重点单位、公共设施、安全隐患排查清单</p>
        </div>
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700 shadow-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'all' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            全部设施
          </button>
          <button
            onClick={() => setFilter('issue')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
              filter === 'issue' 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            存在隐患
          </button>
          <button
            onClick={() => setFilter('normal')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
              filter === 'normal' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            运行正常
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2 pb-6">
        {filteredFacilities.map((facility) => {
          const isIssue = facility.status !== '正常';
          
          return (
            <div 
              key={facility.id} 
              className={`bg-gray-800 border rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
                isIssue ? 'border-red-500/30 ring-1 ring-red-500/10' : 'border-gray-700 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    isIssue ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  }`}>
                    {isIssue ? <AlertTriangle className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{facility.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded border border-gray-600">
                        {facility.category}
                      </span>
                      <span className="text-xs text-gray-500">{facility.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 mb-5 border border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">负责人</p>
                    <p className="text-sm font-medium text-gray-300">{facility.manager}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">联系电话</p>
                    <p className="text-sm font-medium text-gray-300">{facility.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      当前状态及隐患描述
                    </p>
                    <p className={`text-sm font-medium ${isIssue ? 'text-red-400' : 'text-green-400'}`}>
                      【{facility.status}】 {facility.issueDesc || '暂无异常'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-700/50">
                {isIssue ? (
                  <button 
                    onClick={() => handleStatusUpdate(facility.id, '正常')}
                    className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    标记为已整改 (正常)
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(facility.id, '需整改')}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      上报隐患 (需整改)
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(facility.id, '需清理')}
                      className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      上报隐患 (需清理)
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

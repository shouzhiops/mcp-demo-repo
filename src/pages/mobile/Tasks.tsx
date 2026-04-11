import React, { useState } from 'react';
import { useStore } from '../../store';
import { Clock, CheckCircle, ChevronDown, ListTodo } from 'lucide-react';

const MobileTasks: React.FC = () => {
  const { incidents, updateIncidentStatus } = useStore();
  const [filter, setFilter] = useState<'全部' | '待处理' | '处理中' | '已结案'>('全部');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const filteredIncidents = filter === '全部' 
    ? incidents 
    : incidents.filter(i => i.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待处理': return 'bg-blue-100 text-blue-700';
      case '处理中': return 'bg-orange-100 text-orange-700';
      case '已结案': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = (id: string, newStatus: '待处理' | '处理中' | '已结案') => {
    updateIncidentStatus(id, newStatus);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      <div className="flex items-center space-x-2 mb-6 px-1">
        <ListTodo className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">我的任务</h2>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4 hide-scrollbar">
        {['全部', '待处理', '处理中', '已结案'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as '全部' | '待处理' | '处理中' | '已结案')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {status}
            <span className="ml-1 opacity-70">
              ({status === '全部' ? incidents.length : incidents.filter(i => i.status === status).length})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-100 mt-4">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>暂无{filter !== '全部' ? filter : ''}任务</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div 
              key={incident.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200"
            >
              <div 
                className="p-4 cursor-pointer flex justify-between items-start"
                onClick={() => setExpandedTask(expandedTask === incident.id ? null : incident.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(incident.createTime).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">{incident.title}</h3>
                  
                  {!expandedTask || expandedTask !== incident.id ? (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{incident.desc}</p>
                  ) : null}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform mt-1 ${
                  expandedTask === incident.id ? 'rotate-180' : ''
                }`} />
              </div>

              {expandedTask === incident.id && (
                <div className="px-4 pb-4 border-t border-gray-50 bg-gray-50/50 pt-3">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{incident.desc}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-4 bg-white p-3 rounded-lg border border-gray-100">
                    <div>
                      <span className="block text-gray-400 mb-0.5">上报人</span>
                      <span className="font-medium text-gray-700">{incident.reporter}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 mb-0.5">处理人</span>
                      <span className="font-medium text-gray-700">{incident.assignedTo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-2">
                    <span className="text-xs font-medium text-gray-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      更改状态
                    </span>
                    <div className="flex space-x-2">
                      {incident.status !== '待处理' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(incident.id, '待处理'); }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100"
                        >
                          待处理
                        </button>
                      )}
                      {incident.status !== '处理中' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(incident.id, '处理中'); }}
                          className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium hover:bg-orange-100"
                        >
                          处理中
                        </button>
                      )}
                      {incident.status !== '已结案' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(incident.id, '已结案'); }}
                          className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium hover:bg-green-100"
                        >
                          已结案
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileTasks;

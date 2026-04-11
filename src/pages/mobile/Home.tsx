import React from 'react';
import { useStore } from '../../store';
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const MobileHome: React.FC = () => {
  const { incidents } = useStore();

  const pendingTasks = incidents.filter(i => i.status === '待处理').length;
  const inProgressTasks = incidents.filter(i => i.status === '处理中').length;
  const completedTasks = incidents.filter(i => i.status === '已结案').length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-4 border-indigo-50">
          张
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">张网格</h2>
          <p className="text-sm text-gray-500">新华村 第一网格</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">今日概览</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-700">{pendingTasks}</span>
            <span className="text-sm text-blue-600">待处理</span>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl flex flex-col items-center justify-center space-y-2">
            <Clock className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-700">{inProgressTasks}</span>
            <span className="text-sm text-orange-600">处理中</span>
          </div>
          <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center justify-center space-y-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-700">{completedTasks}</span>
            <span className="text-sm text-green-600">已结案</span>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl flex flex-col items-center justify-center space-y-2">
            <ClipboardList className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-700">{incidents.length}</span>
            <span className="text-sm text-purple-600">全部任务</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">最新动态</h3>
        <div className="space-y-4">
          {incidents.slice(0, 3).map((incident) => (
            <div key={incident.id} className="flex items-start space-x-3">
              <div className={`mt-1 w-2 h-2 rounded-full ${
                incident.status === '待处理' ? 'bg-blue-500' :
                incident.status === '处理中' ? 'bg-orange-500' : 'bg-green-500'
              }`} />
              <div>
                <p className="text-sm font-medium text-gray-800">{incident.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{incident.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(incident.createTime).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {incidents.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">暂无动态</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHome;

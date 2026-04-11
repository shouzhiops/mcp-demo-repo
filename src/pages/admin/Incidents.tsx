import { useState } from 'react';
import { useStore } from '../../store';
import { Search, ClipboardCheck, AlertCircle, Clock, CheckCircle, AlertTriangle, Play, Check } from 'lucide-react';
import { Incident } from '../../types';

export default function Incidents() {
  const { incidents, updateIncidentStatus, updateIncident } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignee, setAssignee] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchSearch = inc.title.includes(searchTerm) || inc.desc.includes(searchTerm) || inc.reporter.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDispatchClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setAssignee('');
    setDispatchModalOpen(true);
  };

  const handleCloseClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setCloseModalOpen(true);
  };

  const handleDispatchConfirm = () => {
    if (selectedIncident && assignee.trim() !== '') {
      updateIncident(selectedIncident.id, { assignedTo: assignee });
      updateIncidentStatus(selectedIncident.id, '处理中');
      setDispatchModalOpen(false);
    }
  };

  const handleCloseConfirm = () => {
    if (selectedIncident) {
      updateIncidentStatus(selectedIncident.id, '已结案');
      setCloseModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待处理': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case '处理中': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case '已结案': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '待处理': return <AlertTriangle className="w-4 h-4 mr-1" />;
      case '处理中': return <Clock className="w-4 h-4 mr-1" />;
      case '已结案': return <CheckCircle className="w-4 h-4 mr-1" />;
      default: return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide">工单分拨中心</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索工单标题或内容..."
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
            <option value="待处理">待处理</option>
            <option value="处理中">处理中</option>
            <option value="已结案">已结案</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-sm tracking-wider uppercase">
                <th className="p-4 font-medium">工单编号</th>
                <th className="p-4 font-medium w-1/3">标题 / 描述</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">上报人 / 时间</th>
                <th className="p-4 font-medium">处理人</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredIncidents.map((incident, idx) => (
                <tr key={incident.id} className={`hover:bg-gray-700/30 transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-800/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{incident.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-200 font-medium">{incident.title}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{incident.desc}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded-md ${getStatusColor(incident.status)}`}>
                      {getStatusIcon(incident.status)}
                      {incident.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300">{incident.reporter}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(incident.createTime).toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </td>
                  <td className="p-4">
                    {incident.assignedTo ? (
                      <span className="text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                        {incident.assignedTo}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic text-sm">暂无</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {incident.status === '待处理' && (
                        <button
                          onClick={() => handleDispatchClick(incident)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>派发</span>
                        </button>
                      )}
                      {incident.status === '处理中' && (
                        <button
                          onClick={() => handleCloseClick(incident)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-md transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          <span>结案</span>
                        </button>
                      )}
                      {incident.status === '已结案' && (
                        <button disabled className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 text-gray-400 text-sm font-medium rounded-md cursor-not-allowed">
                          <span>已完成</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredIncidents.length === 0 && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <ClipboardCheck className="w-12 h-12 mb-4 opacity-50" />
              <p>暂无工单数据</p>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">派发工单</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">工单标题</p>
              <p className="text-white bg-gray-900/50 p-3 rounded-lg border border-gray-700">{selectedIncident?.title}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">指派给 (处理人姓名)</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="例如: 张网格、李维修"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDispatchConfirm}
                disabled={assignee.trim() === ''}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                确认派发
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Modal */}
      {closeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">结案确认</h3>
            <p className="text-gray-300 mb-6">
              您确认要将工单 <span className="font-bold text-indigo-400">{selectedIncident?.id}</span> 标记为已结案吗？该操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCloseModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCloseConfirm}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
              >
                确认结案
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { NavBar, Tag, Button, Empty, Toast, Dialog } from 'antd-mobile';
import { ClockCircleOutline, CheckCircleOutline } from 'antd-mobile-icons';
import { MapPin, AlertCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function Tasks() {
  const navigate = useNavigate();
  const orders = useStore(state => state.orders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);
  const addresses = useStore(state => state.addresses);

  const handlerId = 101;
  const myTasks = orders.filter(order => order.handlerId === handlerId);
  const pendingTasks = myTasks.filter(task => task.status !== '已处置' && task.status !== '已销账');
  const completedTasks = myTasks.filter(task => task.status === '已处置' || task.status === '已销账');

  const getAddressName = (addressId: string) => {
    return addresses.find(a => a.id === addressId)?.name || addressId;
  };

  const handleMarkComplete = (id: number) => {
    Dialog.confirm({
      content: '确认标记为已处置吗？',
      onConfirm: async () => {
        updateOrderStatus(id, '已处置');
        Toast.show({
          icon: 'success',
          content: '已完成处置',
        });
      },
    });
  };

  const renderTask = (task: any, isCompleted: boolean) => (
    <div key={task.id} className="bg-white m-3 rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-800 text-lg">
            {task.type}
          </span>
          <Tag color={isCompleted ? 'success' : 'warning'} fill="outline">
            {task.status}
          </Tag>
        </div>
        <span className="text-xs text-gray-400">#{task.id}</span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
          <span>{getAddressName(task.addressId)} ({task.addressId})</span>
        </div>
        <div className="flex items-start">
          <FileText className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
          <span className="line-clamp-2">{task.description || '无详细描述'}</span>
        </div>
        <div className="flex items-start">
          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
          <span>{new Date(task.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {!isCompleted && (
        <div className="flex justify-end pt-2 border-t border-gray-50">
          <Button 
            size="small" 
            color="primary"
            fill="solid"
            onClick={() => handleMarkComplete(task.id)}
            className="rounded-lg px-6 shadow-sm"
          >
            完成处置
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar onBack={() => navigate(-1)} className="bg-white sticky top-0 z-10 shadow-sm">
        待办工单
      </NavBar>
      
      <div className="pb-8">
        {pendingTasks.length > 0 ? (
          <div>
            <div className="px-4 py-3 text-sm text-gray-500 font-medium bg-gray-50 sticky top-11 z-10 flex items-center">
              <ClockCircleOutline className="mr-1" /> 进行中 ({pendingTasks.length})
            </div>
            {pendingTasks.map(task => renderTask(task, false))}
          </div>
        ) : (
          <Empty description="暂无待办任务" />
        )}

        {completedTasks.length > 0 && (
          <div className="mt-4">
            <div className="px-4 py-3 text-sm text-gray-500 font-medium bg-gray-50 flex items-center">
              <CheckCircleOutline className="mr-1" /> 已完成 ({completedTasks.length})
            </div>
            <div className="opacity-75">
              {completedTasks.map(task => renderTask(task, true))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

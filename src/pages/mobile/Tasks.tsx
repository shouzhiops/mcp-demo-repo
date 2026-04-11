import React, { useState } from 'react';
import { NavBar, Tag, Button, Empty, Toast, Dialog, Popup, Image } from 'antd-mobile';
import { ClockCircleOutline, CheckCircleOutline } from 'antd-mobile-icons';
import { MapPin, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function Tasks() {
  const navigate = useNavigate();
  const orders = useStore(state => state.orders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);
  const addresses = useStore(state => state.addresses);

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handlerId = 101;
  const availableTasks = orders.filter(order => order.status === '待分拨' || order.handlerId === handlerId);
  const pendingTasks = availableTasks.filter(task => task.status !== '已处置' && task.status !== '已销账');
  const completedTasks = availableTasks.filter(task => task.status === '已处置' || task.status === '已销账');

  const getAddressName = (addressId: string) => {
    return addresses.find(a => a.id === addressId)?.name || addressId;
  };

  const handleAccept = (id: number) => {
    Dialog.confirm({
      content: '确认接单吗？',
      onConfirm: async () => {
        updateOrderStatus(id, '待处置', handlerId);
        Toast.show({
          icon: 'success',
          content: '接单成功',
        });
      },
    });
  };

  const handleMarkComplete = (id: number) => {
    Dialog.confirm({
      content: '确认标记为已处置吗？',
      onConfirm: async () => {
        updateOrderStatus(id, '已处置', handlerId);
        Toast.show({
          icon: 'success',
          content: '已完成处置',
        });
      },
    });
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setPopupVisible(true);
  };

  const renderTask = (task: any, isCompleted: boolean) => {
    const isPendingAccept = task.status === '待分拨';
    
    return (
      <div 
        key={task.id} 
        className="bg-white mx-4 my-3 rounded-2xl p-4 shadow-sm border border-gray-100/80 transition-all hover:shadow-md cursor-pointer"
        onClick={() => handleTaskClick(task)}
      >
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800 text-lg tracking-tight">
              {task.type}
            </span>
            <Tag 
              color={isCompleted ? 'success' : isPendingAccept ? 'primary' : 'warning'} 
              fill="outline"
              className="rounded-md px-1.5"
            >
              {task.status}
            </Tag>
          </div>
          <span className="text-xs text-gray-400 font-medium">#{task.id}</span>
        </div>
        
        <div className="space-y-2.5 text-sm text-gray-600 mb-4">
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-blue-500 shrink-0" />
            <span className="leading-snug">{getAddressName(task.addressId)} <span className="text-gray-400 text-xs">({task.addressId})</span></span>
          </div>
          <div className="flex items-start">
            <FileText className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
            <span className="line-clamp-2 leading-snug">{task.description || '无详细描述'}</span>
          </div>
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
            <span className="text-gray-500">{new Date(task.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex justify-end pt-3 border-t border-gray-50">
            {isPendingAccept ? (
              <Button 
                size="small" 
                color="primary"
                fill="solid"
                onClick={(e) => { e.stopPropagation(); handleAccept(task.id); }}
                className="rounded-xl px-6 shadow-sm font-medium"
              >
                接单
              </Button>
            ) : (
              <Button 
                size="small" 
                color="success"
                fill="solid"
                onClick={(e) => { e.stopPropagation(); handleMarkComplete(task.id); }}
                className="rounded-xl px-6 shadow-sm font-medium flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                完成处置
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <NavBar 
        onBack={() => navigate(-1)} 
        className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200/50"
      >
        <span className="font-semibold text-lg tracking-wide">待办工单</span>
      </NavBar>
      
      <div className="pb-8 pt-2">
        {pendingTasks.length > 0 ? (
          <div>
            <div className="px-5 py-3 text-sm text-gray-500 font-medium bg-gray-50/90 backdrop-blur-sm sticky top-11 z-10 flex items-center shadow-sm mb-1">
              <ClockCircleOutline className="mr-1.5" /> 进行中 ({pendingTasks.length})
            </div>
            {pendingTasks.map(task => renderTask(task, false))}
          </div>
        ) : (
          <Empty description="暂无待办任务" className="mt-10" />
        )}

        {completedTasks.length > 0 && (
          <div className="mt-6">
            <div className="px-5 py-3 text-sm text-gray-500 font-medium bg-gray-50/90 backdrop-blur-sm sticky top-11 z-10 flex items-center shadow-sm mb-1">
              <CheckCircleOutline className="mr-1.5" /> 已完成 ({completedTasks.length})
            </div>
            <div className="opacity-80">
              {completedTasks.map(task => renderTask(task, true))}
            </div>
          </div>
        )}
      </div>

      <Popup
        visible={popupVisible}
        onMaskClick={() => setPopupVisible(false)}
        bodyStyle={{ minHeight: '40vh', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', padding: '16px' }}
      >
        {selectedTask && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">{selectedTask.type}</span>
              <Tag color={selectedTask.status === '已处置' || selectedTask.status === '已销账' ? 'success' : selectedTask.status === '待分拨' ? 'primary' : 'warning'}>
                {selectedTask.status}
              </Tag>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>工单编号：</strong> #{selectedTask.id}</p>
              <p><strong>位置信息：</strong> {getAddressName(selectedTask.addressId)}</p>
              <p><strong>详细描述：</strong> {selectedTask.description || '无详细描述'}</p>
              <p><strong>上报时间：</strong> {new Date(selectedTask.createdAt).toLocaleString()}</p>
              {selectedTask.images && selectedTask.images.length > 0 && (
                <div>
                  <strong>现场照片：</strong>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {selectedTask.images.map((img: string, i: number) => (
                      <Image key={i} src={img} width={80} height={80} fit="cover" className="rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button block color="primary" className="mt-6" onClick={() => setPopupVisible(false)}>
              关闭
            </Button>
          </div>
        )}
      </Popup>
    </div>
  );
}

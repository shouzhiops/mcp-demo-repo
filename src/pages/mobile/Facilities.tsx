import React, { useState } from 'react';
import { NavBar, ActionSheet, Toast } from 'antd-mobile';
import { Wrench, Search, AlertCircle, CheckCircle2, MoreVertical, MapPin, Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Facilities() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([
    { 
      id: 1, 
      name: '消防栓 XF-001', 
      type: '消防设施', 
      location: '1号楼A座入口处',
      lastCheck: '2023-10-15',
      status: '正常' 
    },
    { 
      id: 2, 
      name: '配电箱 PD-204', 
      type: '电力设施', 
      location: '地下2层设备间',
      lastCheck: '2023-10-10',
      status: '维修中' 
    },
    { 
      id: 3, 
      name: '监控摄像头 Cam-05', 
      type: '安防设施', 
      location: '园区东门入口',
      lastCheck: '2023-10-16',
      status: '故障' 
    },
  ]);

  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [currentFacilityId, setCurrentFacilityId] = useState<number | null>(null);

  const handleStatusChange = (status: string) => {
    setFacilities(facilities.map(f => 
      f.id === currentFacilityId ? { ...f, status } : f
    ));
    setActionSheetVisible(false);
    Toast.show({
      icon: 'success',
      content: '状态已更新',
    });
  };

  const statusColors = {
    '正常': 'text-teal-600 bg-teal-50',
    '维修中': 'text-orange-600 bg-orange-50',
    '故障': 'text-red-600 bg-red-50',
  };

  const getIcon = (type: string) => {
    switch(type) {
      case '消防设施': return <Activity className="w-6 h-6 text-red-500" />;
      case '电力设施': return <Zap className="w-6 h-6 text-yellow-500" />;
      default: return <Wrench className="w-6 h-6 text-teal-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case '消防设施': return 'bg-red-50';
      case '电力设施': return 'bg-yellow-50';
      default: return 'bg-teal-50';
    }
  };

  return (
    <div className="bg-[#F2F2F7] min-h-screen pb-safe">
      {/* 顶部导航 - iOS 毛玻璃效果 */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <NavBar 
          onBack={() => navigate(-1)} 
          className="font-medium"
        >
          实有设施
        </NavBar>
      </div>
      
      {/* 搜索框 (iOS风格) */}
      <div className="px-4 py-3">
        <div className="flex items-center bg-white rounded-2xl px-4 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-teal-100">
          <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="搜索设施编号或名称..." 
            className="bg-transparent border-none outline-none w-full text-[15px] text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 列表区 */}
      <div className="px-4 pb-6 space-y-3">
        {facilities.map(facility => (
          <div 
            key={facility.id} 
            className="bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3.5 flex-1 pr-2">
                <div className={`p-2.5 rounded-xl shrink-0 ${getIconBg(facility.type)}`}>
                  {getIcon(facility.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[16px] font-semibold text-gray-800 leading-snug mb-1 truncate">
                    {facility.name}
                  </h3>
                  <div className="text-[13px] text-gray-500">{facility.type}</div>
                </div>
              </div>
              <div 
                className="p-1 -mr-1 -mt-1 active:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setCurrentFacilityId(facility.id);
                  setActionSheetVisible(true);
                }}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-[13px] text-gray-600">
                  <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span className="truncate">{facility.location}</span>
                </div>
                <span className={`text-[12px] px-2.5 py-1 rounded-lg font-medium shrink-0 ${statusColors[facility.status as keyof typeof statusColors]}`}>
                  {facility.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-gray-400 border-t border-gray-200/50 pt-2">
                <span>最近巡检: {facility.lastCheck}</span>
                {facility.status === '正常' ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 状态更新 ActionSheet */}
      <ActionSheet
        visible={actionSheetVisible}
        actions={[
          { text: '标记为正常', key: '正常', onClick: () => handleStatusChange('正常') },
          { text: '标记为维修中', key: '维修中', onClick: () => handleStatusChange('维修中') },
          { text: '标记为故障', key: '故障', danger: true, onClick: () => handleStatusChange('故障') },
        ]}
        onClose={() => setActionSheetVisible(false)}
        cancelText="取消"
        className="font-medium"
      />
    </div>
  );
}

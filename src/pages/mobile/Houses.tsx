import React, { useEffect } from 'react';
import { NavBar, Tag, Skeleton, ErrorBlock } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Home as HomeIcon, MapPin, User, Phone } from 'lucide-react';

export default function Houses() {
  const navigate = useNavigate();
  const { houses, fetchHouses, loading } = useStore();

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-6">
      <div className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-100">
        <NavBar onBack={() => navigate(-1)}>
          实有房屋
        </NavBar>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {loading && houses.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <Skeleton.Title animated />
                <Skeleton.Paragraph lineCount={3} animated />
              </div>
            ))}
          </div>
        ) : houses.length === 0 ? (
          <div className="mt-20">
             <ErrorBlock status="empty" description="暂无房屋数据" />
          </div>
        ) : (
          <div className="space-y-4">
            {houses.map(house => (
              <div key={house.id} className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                      <HomeIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">房屋 #{house.id}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-0.5">
                        <MapPin size={14} className="mr-1" />
                        {house.address?.name || house.addressId}
                      </div>
                    </div>
                  </div>
                  <Tag color={house.status === '自住' ? 'success' : house.status === '出租' ? 'primary' : 'default'} fill="outline">
                    {house.status || '未知'}
                  </Tag>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center text-sm">
                    <User size={14} className="text-gray-400 mr-1.5 shrink-0" />
                    <span className="text-gray-500 mr-2 shrink-0">业主:</span>
                    <span className="text-gray-800 truncate">{house.ownerName || '暂无'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone size={14} className="text-gray-400 mr-1.5 shrink-0" />
                    <span className="text-gray-500 mr-2 shrink-0">电话:</span>
                    <span className="text-gray-800 truncate">{house.ownerPhone || '暂无'}</span>
                  </div>
                  <div className="flex items-center text-sm col-span-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 ml-1 shrink-0"></div>
                    <span className="text-gray-500 mr-2 shrink-0">用途:</span>
                    <span className="text-gray-800">{house.usage || '暂无'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

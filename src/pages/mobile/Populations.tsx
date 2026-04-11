import React, { useEffect, useState } from 'react';
import { NavBar, Tag, Skeleton, ErrorBlock, SearchBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Users, Phone, MapPin, CreditCard } from 'lucide-react';

export default function Populations() {
  const navigate = useNavigate();
  const { populations, fetchPopulations, loading } = useStore();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPopulations();
  }, [fetchPopulations]);

  const filteredPopulations = populations.filter(p => 
    (p.name && p.name.includes(searchText)) || 
    (p.phone && p.phone.includes(searchText)) ||
    (p.idCard && p.idCard.includes(searchText))
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-6">
      <div className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-100">
        <NavBar onBack={() => navigate(-1)}>
          实有人口
        </NavBar>
        <div className="px-4 pb-3">
          <SearchBar 
            placeholder="搜索姓名/手机号/身份证" 
            value={searchText}
            onChange={v => setSearchText(v)}
            className="bg-gray-100 rounded-xl"
            style={{ '--border-radius': '12px', '--background': '#f3f4f6' }}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {loading && populations.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <Skeleton.Title animated />
                <Skeleton.Paragraph lineCount={3} animated />
              </div>
            ))}
          </div>
        ) : filteredPopulations.length === 0 ? (
          <div className="mt-20">
             <ErrorBlock status="empty" description="暂无人口数据" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPopulations.map(population => (
              <div key={population.id} className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-50 p-2 rounded-xl text-purple-500">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{population.name || '未知'}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-0.5">
                        <MapPin size={14} className="mr-1" />
                        {population.address?.name || population.addressId}
                      </div>
                    </div>
                  </div>
                  <Tag color="primary" fill="outline">
                    {population.type || '常规'}
                  </Tag>
                </div>
                
                <div className="bg-gray-100 rounded-xl p-3 grid grid-cols-1 gap-3 mt-3">
                  <div className="flex items-center text-sm">
                    <Phone size={14} className="text-gray-400 mr-2 shrink-0" />
                    <span className="text-gray-500 mr-2 shrink-0">电话:</span>
                    <span className="text-gray-800 truncate">{population.phone || '暂无'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CreditCard size={14} className="text-gray-400 mr-2 shrink-0" />
                    <span className="text-gray-500 mr-2 shrink-0">身份证:</span>
                    <span className="text-gray-800 truncate">{population.idCard || '暂无'}</span>
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

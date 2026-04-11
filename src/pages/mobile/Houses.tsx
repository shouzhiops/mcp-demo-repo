import React, { useEffect, useState } from 'react';
import { NavBar, Tag, Skeleton, ErrorBlock, Form, Input, Popup, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Home as HomeIcon, MapPin, User, Phone, Plus, Search } from 'lucide-react';

export default function Houses() {
  const navigate = useNavigate();
  const { houses, fetchHouses, loading, addHouse } = useStore();
  
  const [addVisible, setAddVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const onAdd = async (values: any) => {
    try {
      await addHouse({
        ...values,
      });
      setAddVisible(false);
      Toast.show({ icon: 'success', content: '添加成功' });
    } catch (error) {
      Toast.show({ icon: 'fail', content: '添加失败' });
    }
  };

  const filteredHouses = houses.filter(house => 
    (house.ownerName && house.ownerName.toLowerCase().includes(searchKeyword.toLowerCase())) ||
    (house.address?.name && house.address.name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
    (house.addressId && house.addressId.toString().includes(searchKeyword)) ||
    (house.id && house.id.toString().includes(searchKeyword))
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-6">
      <div className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-100">
        <NavBar 
          onBack={() => navigate(-1)}
          right={
            <div className="p-2 -mr-2 active:opacity-50 transition-opacity cursor-pointer" onClick={() => setAddVisible(true)}>
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
          }
        >
          实有房屋
        </NavBar>
      </div>

      {/* 搜索框 (iOS风格) */}
      <div className="px-4 py-3">
        <div className="flex items-center bg-white rounded-2xl px-4 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="搜索房屋、业主..." 
            className="bg-transparent border-none outline-none w-full text-[15px] text-gray-800 placeholder-gray-400"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 pt-0">
        {loading && houses.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <Skeleton.Title animated />
                <Skeleton.Paragraph lineCount={3} animated />
              </div>
            ))}
          </div>
        ) : filteredHouses.length === 0 ? (
          <div className="mt-20">
             <ErrorBlock status="empty" description="暂无房屋数据" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHouses.map(house => (
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

      {/* 新增房屋弹窗 (iOS 半屏模态框风格) */}
      <Popup
        visible={addVisible}
        onMaskClick={() => setAddVisible(false)}
        bodyStyle={{ 
          minHeight: '60vh', 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px',
          backgroundColor: '#F2F2F7'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-5 py-4 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 rounded-t-[24px]">
            <span 
              className="text-[16px] text-gray-500 cursor-pointer active:opacity-50" 
              onClick={() => setAddVisible(false)}
            >
              取消
            </span>
            <h2 className="text-[17px] font-semibold text-gray-800">新增房屋</h2>
            <span className="w-8"></span> {/* 占位保持标题居中 */}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <Form
                layout="horizontal"
                onFinish={onAdd}
                footer={
                  <div className="px-2 pb-4">
                    <Button 
                      block 
                      type="submit" 
                      color="primary" 
                      size="large" 
                      className="rounded-xl shadow-md font-medium text-[16px]"
                    >
                      保存房屋
                    </Button>
                  </div>
                }
              >
                <Form.Item name="addressId" label="关联地址" rules={[{ required: true, message: '请输入地址ID' }]}>
                  <Input placeholder="请输入地址ID" clearable />
                </Form.Item>
                <Form.Item name="status" label="房屋状态" rules={[{ required: true, message: '请输入房屋状态' }]}>
                  <Input placeholder="如: 自住、出租" clearable />
                </Form.Item>
                <Form.Item name="ownerName" label="业主姓名">
                  <Input placeholder="选填" clearable />
                </Form.Item>
                <Form.Item name="ownerPhone" label="联系电话">
                  <Input placeholder="选填" clearable />
                </Form.Item>
                <Form.Item name="usage" label="房屋用途">
                  <Input placeholder="选填" clearable />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

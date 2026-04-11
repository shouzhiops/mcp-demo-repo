import React, { useState, useEffect } from 'react';
import { NavBar, Form, Input, Popup, Button, Toast } from 'antd-mobile';
import { Building2, Search, Plus, Phone, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function Units() {
  const navigate = useNavigate();
  const [addVisible, setAddVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const { units, addUnit, fetchUnits } = useStore();

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const onAdd = async (values: any) => {
    try {
      await addUnit(values);
      setAddVisible(false);
      Toast.show({ icon: 'success', content: '添加成功' });
    } catch (error) {
      Toast.show({ icon: 'fail', content: '添加失败' });
    }
  };

  const filteredUnits = units.filter(unit => 
    (unit.name && unit.name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
    (unit.type && unit.type.toLowerCase().includes(searchKeyword.toLowerCase())) ||
    (unit.legalPerson && unit.legalPerson.toLowerCase().includes(searchKeyword.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-safe">
      {/* 顶部导航 - iOS 毛玻璃效果 */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-100">
        <NavBar 
          onBack={() => navigate(-1)} 
          right={
            <div className="p-2 -mr-2 active:opacity-50 transition-opacity cursor-pointer" onClick={() => setAddVisible(true)}>
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
          }
          className="font-medium"
        >
          实有单位
        </NavBar>
      </div>
      
      {/* 搜索框 (iOS风格) */}
      <div className="px-4 py-3">
        <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="搜索单位名称/类型/法人..." 
            className="bg-transparent border-none outline-none w-full text-[15px] text-gray-800 placeholder-gray-400"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* 列表区 */}
      <div className="px-4 pb-6 space-y-3">
        {filteredUnits.map(unit => (
          <div 
            key={unit.id} 
            className="bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3.5 flex-1 pr-2">
                <div className="bg-indigo-50 p-2.5 rounded-xl shrink-0">
                  <Building2 className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[16px] font-semibold text-gray-800 leading-snug mb-1 truncate">
                    {unit.name}
                  </h3>
                  <div className="text-[13px] text-gray-500">{unit.type || '未知类型'}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 flex flex-col space-y-2">
              <div className="flex items-center text-[13px] text-gray-600">
                <User className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                <span className="truncate">法人: {unit.legalPerson || '暂无'}</span>
              </div>
              <div className="flex items-center text-[13px] text-gray-600">
                <Phone className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                <span className="truncate">电话: {unit.contactPhone || '暂无'}</span>
              </div>
              <div className="flex items-center text-[13px] text-gray-600">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                <span className="truncate">地址: {unit.address?.name || unit.addressId || '暂无'}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredUnits.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            暂无匹配的单位
          </div>
        )}
      </div>

      {/* 新增单位弹窗 */}
      <Popup
        visible={addVisible}
        onMaskClick={() => setAddVisible(false)}
        bodyStyle={{ 
          minHeight: '60vh', 
          borderTopLeftRadius: '24px', 
          borderTopRightRadius: '24px',
          backgroundColor: '#f9fafb' // bg-gray-50
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-5 py-4 backdrop-blur-md bg-white/70 border-b border-gray-100 rounded-t-[24px]">
            <span 
              className="text-[16px] text-gray-500 cursor-pointer active:opacity-50" 
              onClick={() => setAddVisible(false)}
            >
              取消
            </span>
            <h2 className="text-[17px] font-semibold text-gray-800">新增单位</h2>
            <span className="w-8"></span>
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
                      保存单位
                    </Button>
                  </div>
                }
              >
                <Form.Item name="name" label="单位名称" rules={[{ required: true, message: '请输入单位名称' }]}>
                  <Input placeholder="请输入单位名称" clearable />
                </Form.Item>
                <Form.Item name="type" label="单位类型" rules={[{ required: true, message: '请输入单位类型' }]}>
                  <Input placeholder="如: 企业、学校" clearable />
                </Form.Item>
                <Form.Item name="legalPerson" label="法人代表">
                  <Input placeholder="请输入法人姓名" clearable />
                </Form.Item>
                <Form.Item name="contactPhone" label="联系电话">
                  <Input placeholder="请输入联系电话" clearable />
                </Form.Item>
                <Form.Item name="addressId" label="关联地址" rules={[{ required: true, message: '请输入地址ID或名称' }]}>
                  <Input placeholder="请输入地址ID" clearable />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}
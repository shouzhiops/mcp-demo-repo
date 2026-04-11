import React, { useState } from 'react';
import { NavBar, Form, Input, Popup, Button, Toast } from 'antd-mobile';
import { MapPin, Plus, Search, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Addresses() {
  const navigate = useNavigate();
  const [addVisible, setAddVisible] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 1, name: '朝阳区三里屯街道1号院', type: '居住区', status: '已核实' },
    { id: 2, name: '海淀区中关村大街27号', type: '商业区', status: '待核实' },
    { id: 3, name: '西城区金融大街甲9号', type: '办公区', status: '已核实' },
  ]);

  const onAdd = (values: any) => {
    setAddresses([{ id: Date.now(), ...values, status: '待核实' }, ...addresses]);
    setAddVisible(false);
    Toast.show({ icon: 'success', content: '添加成功' });
  };

  return (
    <div className="bg-[#F2F2F7] min-h-screen pb-safe">
      {/* 顶部导航 - iOS 毛玻璃效果 */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <NavBar 
          onBack={() => navigate(-1)} 
          right={
            <div className="p-2 -mr-2 active:opacity-50 transition-opacity cursor-pointer" onClick={() => setAddVisible(true)}>
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
          }
          className="font-medium"
        >
          标准地址
        </NavBar>
      </div>
      
      {/* 搜索框 (iOS风格) */}
      <div className="px-4 py-3">
        <div className="flex items-center bg-white rounded-2xl px-4 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100">
          <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="搜索地址..." 
            className="bg-transparent border-none outline-none w-full text-[15px] text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 列表区 */}
      <div className="px-4 pb-6 space-y-3">
        {addresses.map(addr => (
          <div 
            key={addr.id} 
            className="bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98] active:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5 flex-1 pr-2">
                <div className="bg-blue-50 p-2.5 rounded-xl shrink-0">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-semibold text-gray-800 leading-snug mb-1 truncate">
                    {addr.name}
                  </h3>
                  <div className="flex items-center text-[13px] text-gray-500 space-x-2">
                    <Map className="w-3.5 h-3.5" />
                    <span>{addr.type}</span>
                  </div>
                </div>
              </div>
              <span className={`text-[12px] px-2.5 py-1 rounded-lg shrink-0 font-medium ${
                addr.status === '已核实' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-orange-50 text-orange-600'
              }`}>
                {addr.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 新增地址弹窗 (iOS 半屏模态框风格) */}
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
            <h2 className="text-[17px] font-semibold text-gray-800">新增地址</h2>
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
                      保存地址
                    </Button>
                  </div>
                }
              >
                <Form.Item name="name" label="地址名称" rules={[{ required: true, message: '请输入详细地址' }]}>
                  <Input placeholder="请输入详细地址" clearable />
                </Form.Item>
                <Form.Item name="type" label="地址类型" rules={[{ required: true, message: '请输入地址类型' }]}>
                  <Input placeholder="如: 居住区、商业区" clearable />
                </Form.Item>
                <Form.Item name="code" label="邮政编码">
                  <Input placeholder="选填" clearable />
                </Form.Item>
                <Form.Item name="remark" label="备注信息">
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

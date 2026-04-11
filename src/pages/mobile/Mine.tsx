import React from 'react';
import { NavBar, List, Dialog, Toast } from 'antd-mobile';
import { User, LogOut, Settings, Bell, CircleAlert, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Mine() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: async () => {
        Toast.show({
          icon: 'success',
          content: '已退出登录',
        });
        navigate('/');
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <NavBar 
        back={null} 
        className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-200/50"
      >
        <span className="text-gray-900 font-medium">我的</span>
      </NavBar>
      
      <div className="py-4">
        <List 
          mode="card"
          style={{ '--border-top': 'none', '--border-bottom': 'none' }} 
          className="mb-4 shadow-sm"
        >
          <List.Item
            prefix={
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            }
            description="系统管理员"
          >
            <span className="text-lg font-bold">管理员</span>
          </List.Item>
        </List>

        <List 
          mode="card"
          style={{ '--border-top': 'none', '--border-bottom': 'none', '--border-inner': '1px solid #f3f4f6' }}
          className="mb-4 shadow-sm"
        >
          <List.Item prefix={<Bell className="w-5 h-5 text-gray-500" />} extra={<ChevronRight className="w-4 h-4 text-gray-400" />} clickable>
            消息通知
          </List.Item>
          <List.Item prefix={<Settings className="w-5 h-5 text-gray-500" />} extra={<ChevronRight className="w-4 h-4 text-gray-400" />} clickable>
            系统设置
          </List.Item>
          <List.Item prefix={<CircleAlert className="w-5 h-5 text-gray-500" />} extra={<ChevronRight className="w-4 h-4 text-gray-400" />} clickable>
            关于我们
          </List.Item>
        </List>

        <List mode="card" style={{ '--border-top': 'none', '--border-bottom': 'none' }} className="shadow-sm">
          <List.Item 
            prefix={<LogOut className="w-5 h-5 text-red-500" />} 
            onClick={handleLogout}
            clickable
          >
            <span className="text-red-500 font-medium">退出登录</span>
          </List.Item>
        </List>
      </div>
    </div>
  );
}

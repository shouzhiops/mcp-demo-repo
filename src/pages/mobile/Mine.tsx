import React, { useState } from 'react';
import { NavBar, List, Dialog, Toast } from 'antd-mobile';
import { User, LogOut, Settings, Bell, CircleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const listStyle: React.CSSProperties = {
  '--border-top': 'none',
  '--border-bottom': 'none',
} as React.CSSProperties;

const menuListStyle: React.CSSProperties = {
  ...listStyle,
  '--border-inner': '1px solid #f3f4f6',
} as React.CSSProperties;

export default function Mine() {
  const navigate = useNavigate();

  const [userInfo] = useState({
    name: '管理员',
    role: '系统管理员',
    avatar: <User className="w-8 h-8 text-blue-600" />,
  });

  const menuItems = [
    { key: 'notifications', title: '消息通知', icon: <Bell className="w-5 h-5 text-gray-500" /> },
    { key: 'settings', title: '系统设置', icon: <Settings className="w-5 h-5 text-gray-500" /> },
    { key: 'about', title: '关于我们', icon: <CircleAlert className="w-5 h-5 text-gray-500" /> },
  ];

  const handleLogout = () => {
    Dialog.confirm({
      content: '确定要退出登录吗？',
      onConfirm: async () => {
        localStorage.clear();
        Toast.show({
          icon: 'success',
          content: '已退出登录',
        });
        navigate('/', { replace: true });
      },
    });
  };

  const handleMenuClick = (title: string) => {
    Toast.show({
      content: `点击了${title}`,
      position: 'bottom',
    });
  };

  return (
    <div 
      className="bg-gray-50 min-h-screen pb-20" 
      style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
    >
      <NavBar 
        back="返回"
        onBack={() => navigate('/mobile')}
        className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-200/50"
      >
        <span className="text-gray-900 font-medium">我的</span>
      </NavBar>
      
      <div className="py-4">
        <List 
          mode="card"
          style={listStyle} 
          className="mb-4 shadow-sm"
        >
          <List.Item
            prefix={
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                {userInfo.avatar}
              </div>
            }
            description={userInfo.role}
          >
            <span className="text-lg font-bold">{userInfo.name}</span>
          </List.Item>
        </List>

        <List 
          mode="card"
          style={menuListStyle}
          className="mb-4 shadow-sm"
        >
          {menuItems.map(item => (
            <List.Item 
              key={item.key}
              prefix={item.icon} 
              arrow
              clickable
              onClick={() => handleMenuClick(item.title)}
            >
              {item.title}
            </List.Item>
          ))}
        </List>

        <List mode="card" style={listStyle} className="shadow-sm">
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

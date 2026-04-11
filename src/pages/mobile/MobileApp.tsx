import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import { Home as HomeIcon, LayoutGrid, User } from 'lucide-react';
import Home from './Home';
import Apps from './Apps';
import Mine from './Mine';
import Report from './Report';
import Tasks from './Tasks';
import Register from './Register';
import Addresses from './Addresses';
import Houses from './Houses';
import Units from './Units';
import Facilities from './Facilities';
import { useStore } from '../../store';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const tabs = [
    {
      key: '/mobile',
      title: '首页',
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      key: '/mobile/apps',
      title: '工作台',
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      key: '/mobile/mine',
      title: '我的',
      icon: <User className="w-5 h-5" />,
    },
  ];

  // Only show tab bar on these pages
  const showTabBar = ['/mobile', '/mobile/', '/mobile/apps', '/mobile/mine'].includes(pathname);

  if (!showTabBar) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
      <TabBar
        activeKey={pathname === '/mobile/' ? '/mobile' : pathname}
        onChange={value => navigate(value)}
        safeArea
        className="h-16 px-2"
      >
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
};

export default function MobileApp() {
  const { fetchAddresses, fetchOrders, fetchPopulations } = useStore();

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
    fetchPopulations();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full sm:max-w-md mx-auto relative overflow-hidden shadow-xl">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/mine" element={<Mine />} />
          <Route path="/report" element={<Report />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/units" element={<Units />} />
          <Route path="/facilities" element={<Facilities />} />
        </Routes>
      </div>
      <BottomBar />
    </div>
  );
}

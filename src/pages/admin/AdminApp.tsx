import React, { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  HomeOutlined,
  ShopOutlined,
  SafetyOutlined,
  AlertOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Dashboard from './Dashboard';
import Address from './Address';
import Population from './Population';
import House from './House';
import Unit from './Unit';
import Facility from './Facility';
import Orders from './Orders';
import { useStore } from '../../store';

const { Header, Sider, Content } = Layout;

export default function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchAddresses, fetchOrders, fetchPopulations, fetchHouses, fetchUnits, fetchFacilities } = useStore();

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
    fetchPopulations();
    fetchHouses();
    fetchUnits();
    fetchFacilities();
  }, []);

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: '工作台概览' },
    { key: '/admin/address', icon: <EnvironmentOutlined />, label: '标准地址台账' },
    { key: '/admin/population', icon: <TeamOutlined />, label: '实有人口台账' },
    { key: '/admin/house', icon: <HomeOutlined />, label: '实有房屋台账' },
    { key: '/admin/unit', icon: <ShopOutlined />, label: '实有单位台账' },
    { key: '/admin/facility', icon: <SafetyOutlined />, label: '实有设施台账' },
    { key: '/admin/orders', icon: <AlertOutlined />, label: '隐患分拨调度' },
  ];

  return (
    <Layout className="min-h-screen font-sans">
      <Sider width={240} theme="dark" className="fixed left-0 h-screen shadow-xl">
        <div className="h-16 flex items-center justify-center bg-gray-900 border-b border-gray-800">
          <span className="text-white text-lg font-bold tracking-wider">
            农村一标四实系统
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="mt-4"
        />
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors px-4 py-2 rounded-md hover:bg-gray-800">
            <LogoutOutlined className="mr-3" />
            <span>退出登录</span>
          </div>
        </div>
      </Sider>
      <Layout className="ml-[240px]">
        <Header className="bg-white px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="text-gray-600 font-medium">欢迎回来，村委书记/内勤</div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              书
            </div>
          </div>
        </Header>
        <Content className="p-8 bg-gray-50/50 min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/address" element={<Address />} />
            <Route path="/population" element={<Population />} />
            <Route path="/house" element={<House />} />
            <Route path="/unit" element={<Unit />} />
            <Route path="/facility" element={<Facility />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

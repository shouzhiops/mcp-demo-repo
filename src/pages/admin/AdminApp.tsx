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
  UserOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Dashboard from './Dashboard';
import Address from './Address';
import Population from './Population';
import House from './House';
import Unit from './Unit';
import Facility from './Facility';
import Orders from './Orders';
import Users from './Users';
import Roles from './Roles';
import { useStore } from '../../store';

const { Header, Sider, Content } = Layout;

export default function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchAddresses, fetchOrders, fetchPopulations, fetchHouses, fetchUnits, fetchFacilities, currentUser, logout } = useStore();

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
    fetchPopulations();
    fetchHouses();
    fetchUnits();
    fetchFacilities();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const allMenuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: '工作台概览' },
    { key: '/admin/address', icon: <EnvironmentOutlined />, label: '标准地址台账' },
    { key: '/admin/population', icon: <TeamOutlined />, label: '实有人口台账' },
    { key: '/admin/house', icon: <HomeOutlined />, label: '实有房屋台账' },
    { key: '/admin/unit', icon: <ShopOutlined />, label: '实有单位台账' },
    { key: '/admin/facility', icon: <SafetyOutlined />, label: '实有设施台账' },
    { key: '/admin/orders', icon: <AlertOutlined />, label: '隐患分拨调度' },
    { key: '/admin/users', icon: <UserOutlined />, label: '村委班子' },
    { key: '/admin/roles', icon: <SafetyCertificateOutlined />, label: '权限管理' },
  ];

  const userPermissions = (currentUser?.roles || []).map(r => r.permissions || '').join(',');
  const isSuperAdmin = userPermissions.includes('all');
  const permissionList = userPermissions.split(',');

  const menuItems = allMenuItems.filter(item => {
    if (isSuperAdmin) return true;
    return permissionList.includes(item.key) || permissionList.includes('admin');
  });

  return (
    <Layout className="min-h-screen font-sans">
      <Sider width={180} theme="dark" className="fixed left-0 h-screen shadow-xl">
        <div className="h-16 flex items-center justify-center bg-gray-900 border-b border-gray-800">
          <span className="text-white text-base font-bold">
            莲麻村治理中心
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
          <div 
            className="flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors px-2 py-2 rounded-md hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogoutOutlined className="mr-2" />
            <span>退出</span>
          </div>
        </div>
      </Sider>
      <Layout className="ml-[180px]">
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
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

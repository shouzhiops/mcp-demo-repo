import React, { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  AlertOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Dashboard from './Dashboard';
import Address from './Address';
import Population from './Population';
import Orders from './Orders';
import { useStore } from '../../store';

const { Header, Sider, Content } = Layout;

export default function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchAddresses, fetchOrders, fetchPopulations } = useStore();

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
    fetchPopulations();
  }, []);

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: '工作台概览' },
    { key: '/admin/address', icon: <EnvironmentOutlined />, label: '标准地址台账' },
    { key: '/admin/population', icon: <TeamOutlined />, label: '实有人口台账' },
    { key: '/admin/orders', icon: <AlertOutlined />, label: '隐患分拨调度' },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider width={250} theme="light" className="shadow-md">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-blue-600">农村一标四实系统</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-r-0 pt-4"
        />
      </Sider>
      <Layout>
        <Header className="bg-white shadow-sm flex items-center px-6">
          <span className="text-gray-500">欢迎使用 PC 管理端</span>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm min-h-[280px]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/address" element={<Address />} />
            <Route path="/population" element={<Population />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

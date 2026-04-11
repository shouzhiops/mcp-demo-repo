import React from 'react';
import { NavBar, Grid, Card } from 'antd-mobile';
import { Camera, Users, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: '随手拍',
      icon: <Camera className="w-8 h-8 text-blue-500" />,
      path: '/mobile/report'
    },
    {
      title: '人员登记',
      icon: <Users className="w-8 h-8 text-green-500" />,
      path: '/mobile/register'
    },
    {
      title: '待办工单',
      icon: <ClipboardList className="w-8 h-8 text-orange-500" />,
      path: '/mobile/tasks'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-full">
      <NavBar back={null} className="bg-blue-600 text-white">
        快捷工作台
      </NavBar>
      
      <div className="p-4">
        <Card title="应用中心" className="shadow-sm border-none rounded-xl">
          <Grid columns={3} gap={16}>
            {menuItems.map((item, index) => (
              <Grid.Item key={index} onClick={() => navigate(item.path)}>
                <div className="flex flex-col items-center justify-center p-3 active:bg-gray-50 rounded-lg transition-colors">
                  <div className="mb-2 bg-gray-50 p-3 rounded-full shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{item.title}</span>
                </div>
              </Grid.Item>
            ))}
          </Grid>
        </Card>
      </div>
    </div>
  );
}

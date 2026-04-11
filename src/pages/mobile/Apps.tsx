import React from 'react';
import { NavBar, Grid, Card } from 'antd-mobile';
import { MapPin, Home as HomeIcon, Users, Building2, Wrench, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Apps() {
  const navigate = useNavigate();

  const modules = [
    {
      title: '地址',
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      path: '/mobile/addresses'
    },
    {
      title: '房屋',
      icon: <HomeIcon className="w-8 h-8 text-green-500" />,
      path: '/mobile/houses'
    },
    {
      title: '人口',
      icon: <Users className="w-8 h-8 text-purple-500" />,
      path: '/mobile/register'
    },
    {
      title: '单位',
      icon: <Building2 className="w-8 h-8 text-orange-500" />,
      path: '/mobile/units'
    },
    {
      title: '设施',
      icon: <Wrench className="w-8 h-8 text-teal-500" />,
      path: '/mobile/facilities'
    },
    {
      title: '工单',
      icon: <ClipboardList className="w-8 h-8 text-red-500" />,
      path: '/mobile/tasks'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-full pb-20">
      <NavBar back={null} className="bg-blue-600 text-white">
        工作台
      </NavBar>
      
      <div className="p-4">
        <Card title="基础业务" className="shadow-sm border-none rounded-xl">
          <Grid columns={3} gap={16}>
            {modules.map((item, index) => (
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

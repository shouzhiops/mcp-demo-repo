import React from 'react';
import { NavBar, Grid, Card, Badge } from 'antd-mobile';
import { Camera, Users, ClipboardList, MapPin, Home as HomeIcon, Building2, Wrench, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function Home() {
  const navigate = useNavigate();
  const orders = useStore(state => state.orders);
  const currentUser = useStore(state => state.currentUser);

  const handlerId = currentUser?.id || 101;
  const availableTasks = orders.filter(order => order.status === '待分拨' || order.handlerId === handlerId);
  const pendingTasks = availableTasks.filter(task => task.status !== '已处置' && task.status !== '已销账');
  const pendingCount = pendingTasks.length;

  const allMenuItems = [
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
      path: '/mobile/tasks',
      badge: pendingCount > 0 ? pendingCount : null
    }
  ];

  const allModules = [
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
      path: '/mobile/tasks',
      badge: pendingCount > 0 ? pendingCount : null
    }
  ];

  const userPermissions = currentUser?.role?.permissions || '';
  const isSuperAdmin = userPermissions === 'all';
  const permissionList = userPermissions.split(',');

  const filterMenu = (item: any) => {
    if (isSuperAdmin) return true;
    return permissionList.includes(item.path);
  };

  const menuItems = allMenuItems.filter(filterMenu);
  const modules = allModules.filter(filterMenu);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <NavBar 
        back={null} 
        left={
          <div onClick={() => navigate('/mobile/mine')} className="flex items-center justify-center cursor-pointer text-gray-800">
            <User className="w-6 h-6" />
          </div>
        }
        className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-200/50"
      >
        <span className="text-gray-900 font-medium">首页</span>
      </NavBar>
      
      <div className="p-4 space-y-4">
        <Card title="快捷操作" className="shadow-sm border-none rounded-2xl">
          <Grid columns={3} gap={16}>
            {menuItems.map((item, index) => (
              <Grid.Item key={index} onClick={() => navigate(item.path)}>
                <div className="flex flex-col items-center justify-center p-3 active:bg-gray-50 rounded-lg transition-colors">
                  <div className="mb-2 bg-gray-50 p-3 rounded-full shadow-sm">
                    {item.badge ? (
                      <Badge content={item.badge}>{item.icon}</Badge>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{item.title}</span>
                </div>
              </Grid.Item>
            ))}
          </Grid>
        </Card>

        <Card title="基础业务" className="shadow-sm border-none rounded-2xl">
          <Grid columns={3} gap={16}>
            {modules.map((item, index) => (
              <Grid.Item key={index} onClick={() => navigate(item.path)}>
                <div className="flex flex-col items-center justify-center p-3 active:bg-gray-50 rounded-lg transition-colors">
                  <div className="mb-2 bg-gray-50 p-3 rounded-full shadow-sm">
                    {item.badge ? (
                      <Badge content={item.badge}>{item.icon}</Badge>
                    ) : (
                      item.icon
                    )}
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

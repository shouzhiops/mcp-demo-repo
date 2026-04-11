import React from 'react';
import { NavBar, Card, Dialog, Toast } from 'antd-mobile';
import { User, LogOut } from 'lucide-react';
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
    <div className="bg-gray-100 min-h-full pb-20">
      <NavBar back={null} className="bg-blue-600 text-white">
        我的
      </NavBar>
      
      <div className="p-4">
        <Card className="shadow-sm border-none rounded-xl mb-4">
          <div className="flex items-center p-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold">管理员</div>
              <div className="text-sm text-gray-500 mt-1">系统管理员</div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border-none rounded-xl">
          <div 
            className="flex items-center justify-between p-2 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            <div className="flex items-center">
              <LogOut className="w-6 h-6 mr-3" />
              <span className="text-base font-medium">退出登录</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, ListTodo, Monitor } from 'lucide-react';

const MobileLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/mobile', label: '首页', icon: Home, exact: true },
    { path: '/mobile/report', label: '上报', icon: PlusCircle, exact: false },
    { path: '/mobile/tasks', label: '任务', icon: ListTodo, exact: false },
  ];

  return (
    <div className="flex justify-center h-screen bg-gray-900 overflow-hidden text-gray-900 font-sans relative">
      {/* Quick return to PC button for demo purposes */}
      <Link 
        to="/" 
        className="absolute top-4 right-4 bg-gray-800 border border-gray-700 text-gray-300 p-2 rounded-full shadow-lg hover:bg-gray-700 hover:text-white transition-colors z-50 flex items-center gap-2 group"
        title="返回PC端"
      >
        <Monitor className="w-5 h-5" />
        <span className="text-xs font-medium pr-1 opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto overflow-hidden">返回PC</span>
      </Link>

      <div className="flex flex-col h-full max-w-md w-full bg-gray-50 shadow-2xl relative">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-16">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2 pb-safe z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-indigo-100' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileLayout;

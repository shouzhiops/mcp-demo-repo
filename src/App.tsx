import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Ledger from './pages/Ledger';
import Incidents from './pages/admin/Incidents';
import MobileLayout from './pages/mobile/MobileLayout';
import MobileHome from './pages/mobile/Home';
import MobileReport from './pages/mobile/Report';
import MobileTasks from './pages/mobile/Tasks';
import Home from './pages/Home';
import Toast from './components/Toast';
import { LayoutDashboard, FileText, Smartphone, Inbox } from 'lucide-react';
import { useStore } from './store';

function Navigation() {
  const location = useLocation();
  const { incidents } = useStore();
  const incidentsCount = incidents.filter(i => i.status === '待处理').length;

  const links = [
    { path: '/screen', label: '乡村治理大屏', icon: LayoutDashboard },
    { path: '/ledger', label: '以房管人台账', icon: FileText },
    { path: '/admin/incidents', label: '工单分拨中心', icon: Inbox },
    { path: '/mobile', label: '网格员工作台', icon: Smartphone },
  ];

  return (
    <nav className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
          数字乡村
        </h1>
        <p className="text-gray-400 text-sm mt-2 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          一标四实管理平台
        </p>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-2 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
              <span className="font-medium">{link.label}</span>
              {link.path === '/admin/incidents' && incidentsCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {incidentsCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-gray-700">
              书
            </div>
            <div>
              <p className="text-white text-sm font-medium">村支书 (管理员)</p>
              <p className="text-gray-500 text-xs">新华村村委会</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Navigation />
      <main className="flex-1 ml-64 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="h-full relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        {/* 角色入口选择页 */}
        <Route path="/" element={<Home />} />
        
        {/* PC 端路由 */}
        <Route path="/screen" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/ledger" element={<AdminLayout><Ledger /></AdminLayout>} />
        <Route path="/admin/incidents" element={<AdminLayout><Incidents /></AdminLayout>} />
        
        {/* 移动端路由 */}
        <Route path="/mobile" element={<MobileLayout />}>
          <Route index element={<MobileHome />} />
          <Route path="report" element={<MobileReport />} />
          <Route path="tasks" element={<MobileTasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

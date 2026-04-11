import { useNavigate } from 'react-router-dom';
import { Monitor, LayoutDashboard, Smartphone } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'screen',
      title: '乡村治理大屏',
      description: '全景展示乡村数据，实时监控预警，辅助科学决策。',
      icon: Monitor,
      path: '/screen',
      color: 'from-blue-500 to-cyan-400',
      bgHover: 'hover:border-blue-500/50 hover:shadow-blue-500/20'
    },
    {
      id: 'admin',
      title: '后台分拨中心',
      description: '集中处理事件工单，高效流转分配，跟踪处理进度。',
      icon: LayoutDashboard,
      path: '/admin/incidents',
      color: 'from-purple-500 to-pink-500',
      bgHover: 'hover:border-purple-500/50 hover:shadow-purple-500/20'
    },
    {
      id: 'mobile',
      title: '网格员移动端',
      description: '随时随地上报问题，接收处理任务，现场核查反馈。',
      icon: Smartphone,
      path: '/mobile',
      color: 'from-emerald-500 to-teal-400',
      bgHover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight mb-4">
            数字乡村一标四实平台
          </h1>
          <p className="text-gray-400 text-lg">请选择您的工作角色与场景</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => navigate(role.path)}
                className={`group relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm transition-all duration-300 text-left hover:-translate-y-2 hover:shadow-2xl ${role.bgHover}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${role.color}`}></div>
                
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                  {role.title}
                </h2>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {role.description}
                </p>

                <div className="mt-8 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors duration-300">
                  进入系统
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Mic, Upload, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileReport: React.FC = () => {
  const { addIncident } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    reporter: '张网格',
    assignedTo: '未分配',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSimulateVoice = () => {
    // 模拟语音识别填入内容
    setFormData({
      ...formData,
      title: '垃圾堆放严重',
      desc: '二组村道口有一大堆建筑垃圾未清理，严重影响交通和村容村貌。',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desc) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      addIncident({
        title: formData.title,
        desc: formData.desc,
        status: '待处理',
        reporter: formData.reporter,
        assignedTo: formData.assignedTo,
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/mobile/tasks');
      }, 1500);
    }, 800);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">上报成功</h2>
        <p className="text-gray-500 text-center">您的隐患上报已提交，即将跳转至任务列表。</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full pb-24">
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">隐患上报</h2>
          <button 
            type="button"
            onClick={handleSimulateVoice}
            className="flex items-center space-x-1 text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span>模拟AI语音录入</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">隐患标题 <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="请输入隐患标题或使用语音录入"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">详细描述 <span className="text-red-500">*</span></label>
            <textarea 
              value={formData.desc}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
              placeholder="请输入详细的隐患情况描述"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">现场照片</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm">点击拍照或上传照片</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg z-50">
            <button 
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.desc}
              className={`w-full py-3.5 rounded-xl text-white font-medium text-lg transition-all ${
                isSubmitting || !formData.title || !formData.desc 
                  ? 'bg-indigo-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'
              }`}
            >
              {isSubmitting ? '提交中...' : '确认上报'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileReport;

import React, { useEffect } from 'react';
import { useStore } from '../store';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useStore();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, toast.message, hideToast]);

  if (!toast.visible) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-gray-800 border-green-500/50';
      case 'error': return 'bg-gray-800 border-red-500/50';
      default: return 'bg-gray-800 border-blue-500/50';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[100] transition-all duration-300 ease-in-out">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md ${getBgColor()}`}>
        {getIcon()}
        <span className="text-white font-medium">{toast.message}</span>
        <button onClick={hideToast} className="ml-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

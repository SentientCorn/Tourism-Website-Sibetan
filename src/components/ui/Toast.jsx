import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Toast = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // Small delay to ensure the DOM is ready and the transition triggers when mounting
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      
      // Auto close after 4 seconds
      const hideTimer = setTimeout(() => {
        handleClose();
      }, 4000);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation before calling onClose
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!message) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className={`min-w-[300px] max-w-md px-4 py-3.5 rounded-xl text-sm flex items-start gap-3 border shadow-2xl ${
        message.type === 'success' 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
          : 'bg-rose-50 border-rose-200 text-rose-800'
      }`}>
        {message.type === 'success' 
          ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" /> 
          : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
        }
        <div className="flex-1 font-medium leading-relaxed pt-0.5">
          {message.text}
        </div>
        <button 
          onClick={handleClose}
          className={`shrink-0 rounded-lg p-1.5 transition-colors cursor-pointer ${
            message.type === 'success'
              ? 'hover:bg-emerald-100 text-emerald-600'
              : 'hover:bg-rose-100 text-rose-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

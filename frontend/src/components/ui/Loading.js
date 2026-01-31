import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md', 
    lg: 'spinner-lg',
  };
  
  const spinnerClass = sizeClasses[size];
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className={`${spinnerClass} mx-auto mb-4 text-primary-500`} />
          <p className="text-gray-300">{text}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <Loader2 className={`${spinnerClass} mx-auto mb-2 text-primary-500`} />
        <p className="text-gray-400 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        
        {/* Center modal */}
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        {/* Modal panel */}
        <div className={`
          inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full
          border border-gray-700
          ${sizeClasses[size]}
          ${className}
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                {title && (
                  <h3 
                    className="text-lg leading-6 font-medium text-white" 
                    id="modal-title"
                  >
                    {title}
                  </h3>
                )}
                
                {showCloseButton && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onClose}
                    className="!p-2 ml-auto"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
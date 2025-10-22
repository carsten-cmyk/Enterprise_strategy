import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Dialog({ open, onClose, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, onClose }) {
  return (
    <div className="p-6 pb-4 border-b">
      <div className="flex items-start justify-between">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export function DialogTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900">
      {children}
    </h2>
  );
}

export function DialogFooter({ children }) {
  return (
    <div className="p-6 pt-4 flex items-center justify-end gap-3">
      {children}
    </div>
  );
}

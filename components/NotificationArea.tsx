
import React from 'react';
import { GameNotification } from '../types';

interface NotificationAreaProps {
  notifications: GameNotification[];
  onDismiss: (id: string) => void;
}

const NotificationArea: React.FC<NotificationAreaProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) {
    return null;
  }

  const getBackgroundColor = (type: GameNotification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-600/80 border-green-500';
      case 'warning': return 'bg-yellow-500/80 border-yellow-400 text-yellow-900';
      case 'error': return 'bg-red-600/80 border-red-500';
      case 'info':
      default:
        return 'bg-blue-600/80 border-blue-500';
    }
  };
  
  const getIcon = (type: GameNotification['type']) => {
    switch (type) {
      case 'success': return '✔️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  return (
    <div className="fixed top-20 right-4 space-y-2 z-50 w-full max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-3 rounded-md shadow-lg text-sm flex items-start justify-between border ${getBackgroundColor(notification.type)} backdrop-blur-sm`}
        >
          <span className="mr-2 text-lg">{getIcon(notification.type)}</span>
          <span className="flex-grow">{notification.message}</span>
          <button
            onClick={() => onDismiss(notification.id)}
            className="ml-2 text-lg font-bold hover:text-gray-300"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationArea;
    
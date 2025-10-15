import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001/ws';

export interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = (factoryId?: number) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      const wsUrl = factoryId ? `${WS_BASE_URL}?factory_id=${factoryId}` : WS_BASE_URL;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Register with factory_id if provided
        if (factoryId && ws.current) {
          ws.current.send(JSON.stringify({
            type: 'register',
            factory_id: factoryId,
          }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);

          // Handle different message types
          if (message.type === 'new_order') {
            playNotificationSound();
            toast({
              title: 'New Order Received',
              description: `Order #${message.data.order_id} has been placed`,
            });
          } else if (message.type === 'order_status_update') {
            toast({
              title: 'Order Status Updated',
              description: `Order #${message.data.order_id} is now ${message.data.status}`,
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch((error) => {
        console.warn('Could not play notification sound:', error);
      });
    } catch (error) {
      console.warn('Notification sound not available:', error);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [factoryId]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
};

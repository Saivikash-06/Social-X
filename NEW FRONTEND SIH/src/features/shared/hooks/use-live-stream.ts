"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BACKEND_URLS } from "../services/api-endpoints";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";

export interface LiveStreamMessage {
  event?: string;
  channel?: string;
  data?: unknown;
  timestamp?: string;
}

export function useLiveStream(channel = "public") {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<LiveStreamMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const user = useAuthStore((state) => state.user);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const wsUrl = new URL(BACKEND_URLS.ANALYTICS_WS);
      if (user?.role) {
        wsUrl.searchParams.set("role", user.role);
      }
      if (user?.id) {
        wsUrl.searchParams.set("user_id", user.id);
      }

      const socket = new WebSocket(wsUrl.toString());
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        // Subscribe to specified channel
        socket.send(
          JSON.stringify({
            action: "subscribe",
            channel: channel,
          })
        );
      };

      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setLastMessage(parsed);
        } catch {
          setLastMessage({ data: event.data });
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        // Graceful exponential backoff reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch {
      setIsConnected(false);
    }
  }, [channel, user?.role, user?.id]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((action: string, payload: Record<string, unknown>) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action, ...payload }));
    }
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
  };
}

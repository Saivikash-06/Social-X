"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NotificationItem } from "../types";

export function useWebSocketNotifications(citizenId?: string) {
  const queryClient = useQueryClient();
  const socketRef = React.useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Connect to backend WebSocket microservice or gracefully simulate
    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL || "wss://echo.websocket.org";

    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        if (citizenId) {
          socket?.send(JSON.stringify({ type: "subscribe", citizenId }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.title) {
            toast.info(data.title, {
              description: data.message,
            });
            queryClient.invalidateQueries({ queryKey: ["citizen-notifications"] });
            queryClient.invalidateQueries({ queryKey: ["citizen-metrics"] });
          }
        } catch {
          // ignore non-json messages
        }
      };

      socket.onerror = () => {
        setIsConnected(false);
      };

      socket.onclose = () => {
        setIsConnected(false);
      };
    } catch {
      setIsConnected(false);
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [citizenId, queryClient]);

  return { isConnected };
}

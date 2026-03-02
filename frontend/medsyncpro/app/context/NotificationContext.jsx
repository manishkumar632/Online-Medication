"use client";

/**
 * NotificationContext.jsx
 *
 * SSE via /api/notifications/stream  (Next.js proxy route — same origin,
 * no cookie domain issue). All other calls go through server actions.
 *
 * The browser never talks to Spring Boot directly.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  requestFirebaseNotificationPermission,
  onMessageListener,
} from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { config } from "@/lib/config";
import {
  fetchNotificationsAction,
  fetchUnreadCountAction,
  markAsReadAction,
  registerFcmTokenAction,
} from "@/action/notificationAction";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, validateSession } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const sseRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // ── Data fetches (via server actions) ──────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const result = await fetchNotificationsAction();
    if (result.success) {
      setNotifications(result.data);
      setUnreadCount(result.data.filter((n) => !n.isRead).length);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    const result = await fetchUnreadCountAction();
    if (result.success) setUnreadCount(result.count);
  }, [user]);

  // ── SSE connection (via Next.js proxy route) ────────────────────────────────
  //
  // Connects to /api/notifications/stream — a Next.js Route Handler on the
  // same origin (localhost:3000). The route handler reads the HttpOnly cookie
  // server-side and opens the real Spring Boot SSE connection from the server.
  // The browser never touches localhost:8080 directly.

  const connectSSE = useCallback(() => {
    if (!user) return;

    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      // Same-origin URL — no CORS, no cookie domain issue.
      const eventSource = new EventSource(
        `${config.basePath}/api/notifications/stream`,
      );

      eventSource.addEventListener("connected", () => {
        console.log("[SSE] Connected via Next.js proxy");
      });

      eventSource.addEventListener("notification", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.info(data.title, { description: data.message });
          fetchNotifications();
          fetchUnreadCount();

          // If a doctor/pharmacist was approved/rejected, re-validate their session.
          if (data.type === "VERIFICATION_DECISION") {
            validateSession?.();
          }
        } catch (e) {
          console.error("[SSE] Failed to parse notification payload", e);
        }
      });

      eventSource.onerror = () => {
        console.warn("[SSE] Connection error — reconnecting in 5 s");
        eventSource.close();
        sseRef.current = null;
        reconnectTimeoutRef.current = setTimeout(() => {
          if (user) connectSSE();
        }, 5000);
      };

      sseRef.current = eventSource;
    } catch (error) {
      console.error("[SSE] Failed to establish connection", error);
      reconnectTimeoutRef.current = setTimeout(() => {
        if (user) {
          fetchUnreadCount();
          connectSSE();
        }
      }, 30000);
    }
  }, [user, fetchNotifications, fetchUnreadCount, validateSession]);

  // ── Setup on login / teardown on logout ────────────────────────────────────

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    connectSSE();

    if (user.role === "ADMIN") {
      requestFirebaseNotificationPermission().then(async (fcmToken) => {
        if (fcmToken) await registerFcmTokenAction(fcmToken);
      });
    }

    return () => {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [user, fetchNotifications, connectSSE]);

  // ── Firebase foreground messages (admin only) ─────────────────────────────

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    const subscribe = () => {
      onMessageListener().then((payload) => {
        toast.info(payload.notification.title, {
          description: payload.notification.body,
        });
        fetchNotifications();
        subscribe();
      });
    };
    subscribe();
  }, [user, fetchNotifications]);

  // ── Mark as read (optimistic) ─────────────────────────────────────────────

  const markAsRead = useCallback(
    async (id) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const result = await markAsReadAction(id);
      if (!result.success) fetchNotifications(); // revert on failure
    },
    [fetchNotifications],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  return context;
};

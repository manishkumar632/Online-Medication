"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { requestFirebaseNotificationPermission, onMessageListener } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "sonner";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user, validateSession } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const sseRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    // ── Fetch notifications from API ──
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/notifications`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.data || []);
                setUnreadCount((data.data || []).filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    }, [user]);

    // ── Fetch unread count ──
    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.data?.unreadCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    }, [user]);

    // ── SSE Connection ──
    const connectSSE = useCallback(() => {
        if (!user) return;

        // Close existing connection
        if (sseRef.current) {
            sseRef.current.close();
            sseRef.current = null;
        }

        // Clear any pending reconnect
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        try {
            const eventSource = new EventSource(
                `${API_BASE_URL}/api/notifications/stream`,
                { withCredentials: true }
            );

            eventSource.addEventListener("connected", () => {
                console.log("SSE connected");
            });

            eventSource.addEventListener("notification", (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Show toast
                    toast.info(data.title, {
                        description: data.message,
                    });

                    // Refresh notifications and unread count
                    fetchNotifications();
                    fetchUnreadCount();

                    // If it's a verification decision, also refresh auth session
                    if (data.type === "VERIFICATION_DECISION") {
                        validateSession?.();
                    }
                } catch (e) {
                    console.error("Failed to parse SSE notification", e);
                }
            });

            eventSource.onerror = () => {
                console.warn("SSE connection error, will reconnect...");
                eventSource.close();
                sseRef.current = null;

                // Reconnect after 5 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (user) {
                        connectSSE();
                    }
                }, 5000);
            };

            sseRef.current = eventSource;
        } catch (error) {
            console.error("Failed to establish SSE connection", error);

            // Fallback: poll every 30 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                if (user) {
                    fetchUnreadCount();
                    connectSSE();
                }
            }, 30000);
        }
    }, [user, fetchNotifications, fetchUnreadCount, validateSession]);

    // ── Setup SSE + Initial Fetch ──
    useEffect(() => {
        if (user) {
            fetchNotifications();
            connectSSE();

            // For admins, also setup Firebase
            if (user.role === 'ADMIN') {
                requestFirebaseNotificationPermission().then(async (token) => {
                    if (token) {
                        try {
                            await fetch(`${API_BASE_URL}/api/admin/fcm-token`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({ token }),
                            });
                        } catch (error) {
                            console.error("Failed to register FCM token", error);
                        }
                    }
                });
            }
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

    // ── Firebase foreground messages (admin only) ──
    useEffect(() => {
        const setupMessageListener = () => {
            onMessageListener().then((payload) => {
                toast.info(`${payload.notification.title}`, {
                    description: payload.notification.body,
                });
                fetchNotifications();
                setupMessageListener();
            });
        };

        if (user && user.role === 'ADMIN') {
            setupMessageListener();
        }
    }, [user, fetchNotifications]);

    // ── Mark as Read ──
    const markAsRead = async (id) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to mark as read", error);
            fetchNotifications();
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};

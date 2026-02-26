"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { requestFirebaseNotificationPermission, onMessageListener } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "sonner"; // Assuming sonner is available based on package.json

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (!user || user.role !== 'ADMIN') return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Pass cookies (access_token)
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

    const registerFcmToken = useCallback(async (token) => {
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
    }, []);

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchNotifications();

            // Setup Firebase FCM
            requestFirebaseNotificationPermission().then((token) => {
                if (token) {
                    registerFcmToken(token);
                }
            });
        }
    }, [user, fetchNotifications, registerFcmToken]);

    // Handle incoming messages
    useEffect(() => {
        const setupMessageListener = () => {
            onMessageListener().then((payload) => {
                toast.info(`${payload.notification.title}`, {
                    description: payload.notification.body,
                });

                // Optimistically increment or refresh
                fetchNotifications();

                // Recursive call to keep listening
                setupMessageListener();
            });
        };

        if (user && user.role === 'ADMIN') {
            setupMessageListener();
        }
    }, [user, fetchNotifications]);

    const markAsRead = async (id) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await fetch(`${API_BASE_URL}/api/admin/notifications/${id}/read`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Failed to mark as read", error);
            // Revert on failure could be implemented here
            fetchNotifications();
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
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

"use server";

/**
 * notificationAction.js — Server Actions for notifications
 *
 * Replaces all direct fetch() calls that were in NotificationContext.
 * serverApiClient reads the HttpOnly cookie server-side and forwards it
 * to Spring Boot — the browser never needs to touch Spring Boot directly.
 */

import { serverApiClient } from "@/lib/api-client";
import { ApiError } from "@/lib/api-client";

// ─── Fetch all notifications ──────────────────────────────────────────────────

export async function fetchNotificationsAction() {
  try {
    const body = await serverApiClient("/notifications");
    return { success: true, data: body.data ?? [] };
  } catch {
    return { success: false, data: [] };
  }
}

// ─── Fetch unread count ───────────────────────────────────────────────────────

export async function fetchUnreadCountAction() {
  try {
    const body = await serverApiClient("/notifications/unread-count");
    return { success: true, count: body.data?.unreadCount ?? 0 };
  } catch {
    return { success: false, count: 0 };
  }
}

// ─── Mark a notification as read ─────────────────────────────────────────────

export async function markAsReadAction(id) {
  if (!id) return { success: false };
  try {
    await serverApiClient(`/notifications/${id}/read`, { method: "PUT" });
    return { success: true };
  } catch {
    return { success: false };
  }
}

// ─── Register FCM token (admin push notifications) ────────────────────────────

export async function registerFcmTokenAction(fcmToken) {
  if (!fcmToken) return { success: false };
  try {
    await serverApiClient("/admin/fcm-token", {
      method: "POST",
      body: JSON.stringify({ token: fcmToken }),
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

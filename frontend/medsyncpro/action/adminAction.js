"use server";

/**
 * adminAction.js — Server Actions for admin user management
 *
 * Replaces all direct fetch() calls in ApprovalQueue and RoleManagement.
 * serverApiClient reads the HttpOnly cookie server-side and forwards it
 * to Spring Boot — fixes the cookie domain mismatch that was causing all
 * admin data fetches to return unauthenticated errors.
 */

import { serverApiClient } from "@/lib/api-client";

// ─── Approval Queue ───────────────────────────────────────────────────────────

export async function fetchPendingUsersAction() {
  try {
    const body = await serverApiClient("/admin/users/pending");
    return { success: true, data: body.data ?? [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function approveUserAction(userId) {
  try {
    await serverApiClient(`/admin/users/${userId}/approve`, {
      method: "PATCH",
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function rejectUserAction(userId) {
  try {
    await serverApiClient(`/admin/users/${userId}/reject`, { method: "PATCH" });
    return { success: true };
  } catch {
    return { success: false };
  }
}

// ─── Role Management ──────────────────────────────────────────────────────────

/**
 * @param {{ role: string, page: number, size: number, search?: string }} params
 */
export async function fetchUsersAction({ role, page, size, search }) {
  try {
    const params = new URLSearchParams({ role, page, size });
    if (search?.trim()) params.append("search", search.trim());
    const body = await serverApiClient(`/admin/users?${params}`);
    return {
      success: true,
      content: body.data?.content ?? [],
      totalPages: body.data?.totalPages ?? 0,
      totalElements: body.data?.totalElements ?? 0,
    };
  } catch {
    return { success: false, content: [], totalPages: 0, totalElements: 0 };
  }
}

export async function fetchUserCountAction(role) {
  try {
    const body = await serverApiClient(
      `/admin/users?role=${role}&page=0&size=1`,
    );
    return { success: true, count: body.data?.totalElements ?? 0 };
  } catch {
    return { success: false, count: 0 };
  }
}

export async function suspendUserAction(userId) {
  try {
    await serverApiClient(`/admin/users/${userId}/suspend`, {
      method: "PATCH",
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

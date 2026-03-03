"use server";

/**
 * documentTypeAction.js — Server Actions for admin document type management
 *
 * All mutations (create, delete, toggle) go through server actions.
 * serverApiClient reads the HttpOnly cookie server-side and forwards it
 * to Spring Boot — the client never sees the backend URL.
 */

import { serverApiClient } from "@/lib/api-client";
import { ApiError } from "@/lib/api-client";

// ─── Create document type & assign to model ─────────────────────────────────

export async function createDocumentTypeAction({
  name,
  description,
  modelType,
  required,
  displayOrder,
}) {
  try {
    const body = await serverApiClient("/admin/document-types", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        modelType,
        required,
        displayOrder,
      }),
    });
    if (body.success) return { success: true, data: body.data };
    return {
      success: false,
      message: body.message ?? "Failed to create document type.",
    };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "An unexpected error occurred.";
    return { success: false, message };
  }
}

// ─── Remove document type from model (soft delete mapping) ──────────────────

export async function removeDocumentTypeMappingAction(mappingId) {
  try {
    const body = await serverApiClient(
      `/admin/document-types/mapping/${mappingId}`,
      { method: "DELETE" },
    );
    if (body.success) return { success: true };
    return {
      success: false,
      message: body.message ?? "Failed to remove document type.",
    };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "An unexpected error occurred.";
    return { success: false, message };
  }
}

// ─── Toggle required / optional ─────────────────────────────────────────────

export async function toggleRequiredAction(mappingId) {
  try {
    const body = await serverApiClient(
      `/admin/document-types/mapping/${mappingId}/toggle-required`,
      { method: "PATCH" },
    );
    if (body.success) return { success: true, data: body.data };
    return {
      success: false,
      message: body.message ?? "Failed to toggle required status.",
    };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "An unexpected error occurred.";
    return { success: false, message };
  }
}

// ─── Toggle active / inactive ───────────────────────────────────────────────

export async function toggleActiveAction(mappingId) {
  try {
    const body = await serverApiClient(
      `/admin/document-types/mapping/${mappingId}/toggle-active`,
      { method: "PATCH" },
    );
    if (body.success) return { success: true, data: body.data };
    return {
      success: false,
      message: body.message ?? "Failed to toggle active status.",
    };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "An unexpected error occurred.";
    return { success: false, message };
  }
}

// ─── Delete document type globally (soft delete) ────────────────────────────

export async function deleteDocumentTypeAction(documentTypeId) {
  try {
    const body = await serverApiClient(
      `/admin/document-types/${documentTypeId}`,
      { method: "DELETE" },
    );
    if (body.success) return { success: true };
    return {
      success: false,
      message: body.message ?? "Failed to delete document type.",
    };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "An unexpected error occurred.";
    return { success: false, message };
  }
}

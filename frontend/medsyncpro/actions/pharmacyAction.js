"use server";

import { serverApiClient } from "@/lib/api-client";

// ─── Pharmacy Actions ────────────────────────────────────────────────────────

/**
 * Fetch prescriptions available to pharmacies.
 * By default, returns paginated newly published prescriptions.
 */
export async function fetchPharmacyPrescriptions(page = 0, size = 20) {
  try {
    const res = await serverApiClient(
      `/pharmacy/prescriptions?page=${page}&size=${size}`
    );
    return { success: true, data: res.data?.data ?? res.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Fetch prescriptions specific to a patient (useful for pharmacy search).
 */
export async function fetchPrescriptionsByPatient(patientId, page = 0, size = 20) {
  try {
    if (!patientId) throw new Error("Patient ID is required");
    
    const res = await serverApiClient(
      `/pharmacy/prescriptions/patient/${patientId}?page=${page}&size=${size}`
    );
    return { success: true, data: res.data?.data ?? res.data };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

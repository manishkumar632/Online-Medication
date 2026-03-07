"use server";
import { serverApiClient } from "@/lib/api-client";

export async function fetchDoctorProfileData(prevState, formData) {
  "use server";
  try {
    const response = await serverApiClient("/doctor/profile", {
      method: "GET",
    });
    return response.data.data;
  } catch {
    return { success: false, data: [] };
  }
}

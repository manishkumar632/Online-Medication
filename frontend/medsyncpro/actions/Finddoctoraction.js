"use server";

import { serverApiClient } from "@/lib/api-client";

/**
 * Fetch all verified doctors and group by specialty to build the specialty grid.
 * @returns {{ success: boolean, data?: { name: string, doctorCount: number }[], message?: string }}
 */
export async function fetchSpecialtiesAction() {
  try {
    console.log("[fetchSpecialtiesAction] REQUEST: GET /doctors/search?size=200&sort=name&direction=asc");
    const body = await serverApiClient(
      "/doctors/search?size=200&sort=name&direction=asc",
    );
    console.log("[fetchSpecialtiesAction] RESPONSE_RAW:", JSON.stringify(body).slice(0, 500) + "...");
    const doctors = body?.data?.content ?? [];

    const map = {};
    for (const d of doctors) {
      const sp = d.specialty?.trim();
      if (!sp) continue;
      map[sp] = (map[sp] ?? 0) + 1;
    }

    const data = Object.entries(map)
      .map(([name, doctorCount]) => ({ name, doctorCount }))
      .sort((a, b) => b.doctorCount - a.doctorCount);

    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Search doctors. Backend searches across name / email / phone / specialty / clinic / city
 * using a single `q` param.
 *
 * @param {{ query?: string, page?: number, size?: number, sort?: string, direction?: string }}
 * @returns {{ success: boolean, data?: { content, totalElements, totalPages, number }, message?: string }}
 */
export async function searchDoctorsAction({
  query,
  page = 0,
  size = 12,
  sort = "name",
  direction = "asc",
}) {
  try {
    const params = new URLSearchParams({ page, size, sort, direction });
    if (query?.trim()) params.set("q", query.trim());

    const endpoint = `/doctors/search?${params.toString()}`;
    console.log(`[searchDoctorsAction] REQUEST: GET ${endpoint} with options:`, { query, page, size, sort, direction });
    
    const body = await serverApiClient(endpoint);
    console.log(`[searchDoctorsAction] RESPONSE (${endpoint}):`, JSON.stringify(body).slice(0, 500) + "...");
    
    const pd = body?.data ?? {};

    return {
      success: true,
      data: {
        content: pd.content ?? [],
        totalElements: pd.totalElements ?? 0,
        totalPages: pd.totalPages ?? 1,
        number: pd.number ?? 0,
      },
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

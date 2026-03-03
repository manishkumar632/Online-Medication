import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

/**
 * GET /api/admin/document-types/[model]
 *
 * Proxies the admin document-types endpoint from Spring Boot.
 * Used by the admin settings verification section.
 */
export async function GET(_request, { params }) {
    const { model } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 },
        );
    }

    try {
        const res = await fetch(
            `${API_URL}/admin/document-types/${model.toUpperCase()}`,
            {
                headers: {
                    Accept: "application/json",
                    Cookie: `access_token=${token}`,
                },
                cache: "no-store",
            },
        );

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to reach API server" },
            { status: 503 },
        );
    }
}

import { fetchPages } from "@/lib/notion"
import { NextRequest, NextResponse } from "next/server"

interface PageItem {
    page: number;
    cursor: string;
}

interface ApiResponse {
    pages: PageItem[];
}

const MAX_PAGES = 10; // Limit the maximum number of pages to fetch

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const pageSize = parseInt(searchParams.get("pageSize") ?? "", 10) || undefined;
    const firstPageId = searchParams.get("firstPageId") || undefined;

    const pages: PageItem[] = [];
    let currentCursor = firstPageId;

    try {
        for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
            const page = await fetchPages(pageSize, currentCursor);
            pages.push({ page: pageNumber, cursor: currentCursor ?? "" });

            if (!page.next_cursor || !page.has_more) break;
            currentCursor = page.next_cursor;
        }

        return NextResponse.json<ApiResponse>({ pages });
    } catch (error) {
        console.error("Error in blog pagination:", error);
        if (firstPageId && pages.length === 0) {
            return NextResponse.json({ error: "Invalid or non-existent firstPageId provided" }, { status: 400 });
        }
        return NextResponse.json({ error: "An unexpected error occurred while fetching blog pages" }, { status: 500 });
    }
}
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
const DEFAULT_PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const pageSize = Math.min(
        parseInt(searchParams.get("pageSize") ?? "", 10) || DEFAULT_PAGE_SIZE,
        100
    );
    const firstPageId = searchParams.get("firstPageId") || undefined;

    const pages: PageItem[] = [];
    let currentCursor = firstPageId;

    try {
        for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
            const page = await fetchPages(pageSize, currentCursor);

            if (!page || !page.results) {
                throw new Error("Invalid response from Notion API");
            }

            pages.push({ page: pageNumber, cursor: currentCursor ?? "" });

            if (!page.next_cursor || !page.has_more) break;
            currentCursor = page.next_cursor;
        }

        return NextResponse.json<ApiResponse>({ pages });
    } catch (error) {
        console.error("Error in blog pagination:", error);
        if (error instanceof Error) {
            if (error.message === "Invalid response from Notion API") {
                return NextResponse.json({ error: "Failed to fetch blog pages from Notion" }, { status: 502 });
            }
            if (firstPageId && pages.length === 0) {
                return NextResponse.json({ error: "Invalid or non-existent firstPageId provided" }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "An unexpected error occurred while fetching blog pages" }, { status: 500 });
    }
}
import { fetchPages } from "@/lib/notion"
import { NextRequest, NextResponse } from "next/server"

interface PageItem {
    page: number;
    cursor: string;
}

interface ApiResponse {
    pages: PageItem[];
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const pageSize = searchParams.get("pageSize");
        const firstPageId = searchParams.get("firstPageId") || "";

        const isPageSize = pageSize ? parseInt(pageSize, 10) : undefined;
        let currentCursor: string = firstPageId;
        const pages: PageItem[] = [{ page: 1, cursor: currentCursor }];
        let pageNumber = 2;

        while (true) {
            try {
                const page = await fetchPages(isPageSize, currentCursor || undefined);
                if (!page.next_cursor || !page.has_more) break;

                currentCursor = page.next_cursor;
                pages.push({ page: pageNumber, cursor: currentCursor });
                pageNumber++;
            } catch (error) {
                if (firstPageId && pageNumber === 2) {
                    return NextResponse.json({ error: "Invalid or non-existent firstPageId provided" }, { status: 400 });
                }
                throw error; // Re-throw other errors to be caught by the outer try-catch
            }
        }

        return NextResponse.json<ApiResponse>({ pages });
    } catch (error) {
        console.error("Error in blog pagination:", error);
        return NextResponse.json({ error: "An unexpected error occurred while fetching blog pages" }, { status: 500 });
    }
}
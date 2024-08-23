import { fetchPages } from "@/lib/notion";
import Link from "next/link";

export default async function Home() {
  const posts = await fetchPages();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        <h1 className="text-3xl md:text-6xl mb-4">OB Blog posts</h1>

        {posts?.results?.map((post: any) => (
          <Link
            key={post.id}
            href={`/blog/${post.properties.Slug.rich_text[0].plain_text}`}
          >
            <article>
              <h3>{post.properties.Title.title[0].plain_text}</h3>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}

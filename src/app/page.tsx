import BlogCard from "@/components/blogCard";
import { fetchPages } from "@/lib/notion";
import Link from "next/link";

export default async function Home() {
  const posts = await fetchPages();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-8 px-12 lg:px-24">
      <div className="">
        <h1 className="text-3xl md:text-6xl mb-4">OB Blog posts</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts?.results?.map((post: any) => {
            const imgFile = post.properties["Preview image"].files[0];
            const img = imgFile.file?.url || imgFile.external?.url;
            const title = post.properties.Title.title[0].plain_text;
            const description =
              post.properties.Description.rich_text[0].plain_text;

            return (
              <Link
                key={post.id}
                href={`/blog/${post.properties.Slug?.formula.string}`}
              >
                <BlogCard
                  flex
                  img={img}
                  title={title}
                  description={description}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

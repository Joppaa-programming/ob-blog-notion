import { fetchBySlug, fetchPageBlocks, notion } from "@/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";

type Types = {
  params: { slug: string };
};

export default async function Page({ params: { slug } }: Types) {
  const post = await fetchBySlug(slug);

  if (!post) return <div>Post not Found!</div>;

  const blocks = await fetchPageBlocks(post.id);

  const renderer = new NotionRenderer({
    client: notion,
  });
  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);

  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

import truncateStr from "@/lib/truncateStr";
import { cn } from "@/lib/utils";
import Image from "next/image";

const BlogCard = ({ flex, img, title, description }: BlogCardProps) => {
  return (
    <article
      className={cn(
        flex ? "w-full" : "max-w-80",
        "hover:opacity-80 transition-opacity duration-700"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
        <Image
          src={img}
          alt={`${encodeURIComponent(title)}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 py-4">
        <h3 className="text-2xl font-bold">{title}</h3>

        <p className="">{truncateStr(description, 125)}</p>
      </div>
    </article>
  );
};

export interface BlogCardProps {
  flex?: boolean;
  img: string;
  title: string;
  description: string;
}

export default BlogCard;

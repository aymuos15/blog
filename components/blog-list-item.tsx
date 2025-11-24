import Link from "next/link";
import { BlogPost } from "@/lib/blog";

interface BlogListItemProps {
  post: BlogPost;
}

export function BlogListItem({ post }: BlogListItemProps) {
  // Alternate between images based on post id
  const backgroundImage = post.id === "understanding-tensors"
    ? 'url(/image1.png)'
    : 'url(/image2.jpeg)';

  // Use black text for tensor-slicing post, white for others
  const textColor = post.id === "tensor-slicing"
    ? "text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]"
    : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]";

  return (
    <Link href={`/${post.id}`} className="block group">
      <article className="py-5 border-b border-border/50 last:border-0">
        <div className="inline-block px-4 py-2 rounded-lg bg-cover bg-center bg-no-repeat backdrop-blur-sm group-hover:brightness-110 transition-all duration-300" style={{ backgroundImage }}>
          <h2 className={`text-lg font-normal tracking-tight ${textColor}`}>
            {post.title}
          </h2>
        </div>
      </article>
    </Link>
  );
}

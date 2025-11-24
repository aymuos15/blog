import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-block mb-12 text-muted-foreground hover:text-[#EE4C2C] transition-colors text-sm">
          ← Back
        </Link>

        <article>
          <header className="mb-12">
            <h1 className="text-3xl font-medium tracking-tight">{post.title}</h1>
          </header>

          <div className="prose prose-stone dark:prose-invert max-w-none text-base leading-relaxed">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-medium mt-12 mb-6 first:mt-0">{paragraph.slice(2)}</h1>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-medium mt-10 mb-4">{paragraph.slice(3)}</h2>;
              } else if (paragraph.startsWith('```')) {
                return null;
              } else if (paragraph.trim().startsWith('-')) {
                return (
                  <li key={index} className="ml-6 list-disc mb-2">
                    {paragraph.trim().slice(2)}
                  </li>
                );
              } else if (paragraph.trim()) {
                return <p key={index} className="mb-6 text-muted-foreground">{paragraph}</p>;
              }
              return null;
            })}
          </div>
        </article>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReluTabs } from "@/components/relu-tabs";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl">
        <article className="animate-in slide-in-from-bottom-4 duration-700">
          <div className="w-full">
            <ReluTabs />
          </div>
        </article>
      </div>
    </div>
  );
}

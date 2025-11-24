import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
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
    <div className="min-h-screen bg-background flex items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="w-full">
        <article className="animate-in slide-in-from-bottom-4 duration-700">
          <div className="px-6">
            <ReluTabs />
          </div>
        </article>
      </div>
    </div>
  );
}

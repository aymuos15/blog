import { getBlogPosts } from "@/lib/blog";
import { BlogListItem } from "@/components/blog-list-item";

export default function Home() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight mb-8">
            Machine Learning through <span className="text-[#EE4C2C]">PyTorch</span>
          </h1>
          <div className="space-y-6 text-muted-foreground text-base leading-relaxed">
            <p>
              PyTorch sometimes works quirkily which makes it intuitively a bit different from the theory one learns.
              This is my attempt to tackle that, in seemingly different topics. However, I hope that, as one reads more,
              they will appreciate the nuances of the topics and choice of the torch functionality alongside it.
            </p>
            <p>
              One can also think of this as my database for Human RAG during conversations with Tom,
              as a means to match his infinite test-time knowledge base.
            </p>
            <p className="italic">
              Lastly, as always, Talk is cheap, show me the code.
            </p>
          </div>
        </header>

        <main className="space-y-0">
          {posts.map((post) => (
            <BlogListItem key={post.id} post={post} />
          ))}
        </main>
      </div>
    </div>
  );
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "understanding-tensors",
    title: "Understanding ReLU",
    excerpt: "Visual representation of the ReLU activation function.",
    content: `GRAPH`,
    date: "2024-11-24",
    author: "ML Practitioner",
    tags: ["PyTorch", "ReLU", "Activation Functions"],
    readTime: "1 min read"
  },
  {
    id: "tensor-slicing",
    title: "Tensor Slicing",
    excerpt: "Interactive visualization of tensor slicing operations in PyTorch.",
    content: `TENSOR_SLICE`,
    date: "2024-11-20",
    author: "ML Practitioner",
    tags: ["PyTorch", "Tensors", "Slicing"],
    readTime: "3 min read"
  }
];

export function getBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}

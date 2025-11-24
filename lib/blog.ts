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
    title: "Understanding Tensors in PyTorch",
    excerpt: "Deep dive into PyTorch tensors and their quirks that differ from mathematical theory.",
    content: `
# Understanding Tensors in PyTorch

Tensors are the fundamental building blocks in PyTorch, but their behavior can be surprisingly different from the mathematical concept you learned in linear algebra class.

## The Memory Layout Quirk

In theory, tensors are abstract mathematical objects. In PyTorch, they're concrete data structures with memory layout considerations:

\`\`\`python
import torch

# These look the same but behave differently
x = torch.randn(3, 4)
y = x.t()  # Transpose - no data copy!
z = y.contiguous()  # Now it's a real copy

print(x.is_contiguous())  # True
print(y.is_contiguous())  # False!
print(z.is_contiguous())  # True
\`\`\`

## Why This Matters

Understanding contiguity affects performance dramatically. Many PyTorch operations require contiguous tensors, and the framework will silently copy data if needed - causing mysterious slowdowns.

## Conclusion

The gap between mathematical theory and PyTorch implementation is where the magic (and bugs) happen. Understanding these nuances makes you a better practitioner.
    `,
    date: "2024-11-24",
    author: "ML Practitioner",
    tags: ["PyTorch", "Tensors", "Memory"],
    readTime: "8 min read"
  },
  {
    id: "autograd-mechanics",
    title: "Autograd Mechanics: What They Don't Tell You",
    excerpt: "The computational graph in PyTorch works differently than you'd expect from calculus.",
    content: `
# Autograd Mechanics: What They Don't Tell You

In calculus class, derivatives are mathematical operations. In PyTorch, autograd is a runtime system that builds computation graphs - and it has opinions.

## The Computational Graph is Dynamic

\`\`\`python
import torch

x = torch.tensor([2.0], requires_grad=True)

# First forward pass
y = x ** 2
y.backward()
print(x.grad)  # tensor([4.])

# Second forward pass - graph is REBUILT
y = x ** 3
y.backward()  # This ADDS to existing gradient!
print(x.grad)  # tensor([16.]) - not what you expected!
\`\`\`

## The Gradient Accumulation Trap

PyTorch accumulates gradients by default. This is intentional for mini-batch training, but trips up newcomers:

\`\`\`python
# Always remember to zero gradients
x.grad.zero_()
y = x ** 3
y.backward()
print(x.grad)  # tensor([12.]) - now correct!
\`\`\`

## Why This Design?

The accumulation behavior makes sense for RNNs and mini-batch SGD, but it's unintuitive from a pure calculus perspective. Understanding the why helps you avoid the bugs.
    `,
    date: "2024-11-20",
    author: "ML Practitioner",
    tags: ["PyTorch", "Autograd", "Gradients"],
    readTime: "7 min read"
  }
];

export function getBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}

# Tech Stack

This blog is built with modern web technologies and best-in-class libraries for creating interactive, mathematically-rich content about machine learning and PyTorch.

## Core Framework & Runtime

- **[Bun](https://bun.sh/)** - Fast all-in-one JavaScript runtime & package manager
- **[Next.js](https://nextjs.org/)** (v16.0.3) - React framework with App Router, SSR, and static generation
- **[React](https://react.dev/)** (v19.2.0) - UI library
- **[TypeScript](https://www.typescriptlang.org/)** (v5) - Type-safe JavaScript

## UI Components & Primitives

- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components built on Radix UI
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible component primitives
  - `@radix-ui/react-tabs` - Accessible tabs component
  - `@radix-ui/react-avatar` - Avatar component
  - `@radix-ui/react-separator` - Separator/divider component
  - `@radix-ui/react-slot` - Slot composition utility
- **[Lucide React](https://lucide.dev/)** (v0.554.0) - Beautiful, consistent SVG icon library

## Styling

- **[Tailwind CSS](https://tailwindcss.com/)** (v4) - Utility-first CSS framework
- **[class-variance-authority](https://cva.style/)** (v0.7.1) - Type-safe component variant builder
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** (v3.4.0) - Merge Tailwind CSS classes intelligently
- **[clsx](https://github.com/lukeed/clsx)** (v2.1.1) - Utility for constructing className strings

## Animations & Motion

- **[Framer Motion](https://www.framer.com/motion/)** (v12.23.24) - Production-ready animation library with React support
  - Smooth tab transitions
  - Animated height changes
  - Interactive gesture handling

## Mathematics Rendering

- **[KaTeX](https://katex.org/)** (v0.16.25) - Fast math typesetting engine
- **[react-katex](https://github.com/talyssonoc/react-katex)** (v3.1.0) - React wrapper for KaTeX
  - Professional equation rendering in the equation tab
  - Support for LaTeX syntax

## Data Visualization

- **[Recharts](https://recharts.org/)** (v2.15.4) - React charting library built on D3
  - Interactive ReLU function visualization
  - Responsive line charts

## Code Highlighting

- **[react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)** (v16.1.0) - Syntax highlighting for code blocks
  - Python code examples
  - Multiple theme support (using Prism)

## Development Tools

- **[ESLint](https://eslint.org/)** (v9) - JavaScript linter
- **[PostCSS](https://postcss.org/)** (via @tailwindcss/postcss v4) - CSS processing

## Project Structure

```
blog/
├── app/
│   ├── layout.tsx          # Root layout with header
│   ├── globals.css         # Global styles and theme variables
│   ├── page.tsx            # Home page (blog list)
│   └── blog/[id]/page.tsx  # Individual blog post pages
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── relu-tabs.tsx       # Main ReLU visualization (uses KaTeX)
│   ├── relu-chart.tsx      # ReLU chart component (uses Recharts)
│   ├── relu-interactive.tsx # Interactive ReLU controls
│   ├── header.tsx          # Sticky header with back button & theme toggle
│   └── theme-toggle.tsx    # Light/dark theme switcher
└── package.json
```

## Key Features

- ✨ **Server-side rendering** with Next.js App Router
- 🎨 **Dark/Light theme toggle** with localStorage persistence
- 🧮 **Professional math typesetting** with KaTeX for equations
- 📊 **Interactive data visualizations** with Recharts
- ⌨️ **Syntax highlighted code blocks** with react-syntax-highlighter
- 🎬 **Smooth animations and transitions** with Framer Motion
- 🎯 **Accessible UI components** built on Radix UI primitives
- 📱 **Responsive design** with Tailwind CSS
- 🔄 **Back navigation** on blog post pages

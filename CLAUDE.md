# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**This project uses Bun as the package manager and runtime.**

```bash
bun dev          # Start development server (http://localhost:3000)
bun run build    # Production build
bun start        # Start production server
bun run lint     # Run ESLint
bun install      # Install dependencies
```

## Architecture Overview

### Blog Data Model

Blog posts are **defined in-memory** in `/lib/blog.ts` as a TypeScript array, not fetched from a CMS or database. This enables static generation at build time.

**Key functions:**
- `getBlogPosts()`: Returns all posts sorted by date (newest first)
- `getBlogPost(id)`: Fetch single post by ID
- `generateStaticParams()`: Pre-renders all blog post routes

**To add a new blog post**: Add an entry to the `blogPosts` array in `/lib/blog.ts` with the required fields (id, title, excerpt, content, date, author, tags, readTime).

### Theme System (Dark/Light Mode)

The theme system uses **CSS variables + class-based dark mode**:

1. **CSS Variables** (`app/globals.css`):
   - Light mode colors defined in `:root`
   - Dark mode colors defined in `.dark` selector
   - Semantic tokens: `--background`, `--foreground`, `--primary`, `--muted`, etc.
   - Chart colors use OKLch format for better perceptual uniformity

2. **Theme Toggle** (`components/theme-toggle.tsx`):
   - Client component that toggles `.dark` class on `<html>` element
   - Persists preference to `localStorage` under key `'theme'`
   - Uses mounted state check to prevent hydration mismatch
   - Direct DOM manipulation for instant visual feedback (not React state)

3. **Tailwind Dark Mode**: Configured with `@custom-variant dark (&:is(.dark *))` in globals.css

### ReLU Visualization Components

The ReLU visualization is a complex interactive feature spanning three components:

**`ReluTabs.tsx`** (Main orchestrator):
- Manages 4 tabs: Graph, Equation, Theory, Code
- **Critical pattern**: Uses `ResizeObserver` to measure each tab's content height
- Stores heights in state object: `{ graph: 400, equation: 350, ... }`
- Animates container height with Framer Motion: `animate={{ height: heights[activeTab] }}`
- Tab content positioned absolutely with opacity transitions to prevent layout thrashing

**`ReluChart.tsx`** (Recharts visualization):
- Generates ReLU function data points: `Math.max(0, x)`
- Dynamic X-axis range controlled by parent
- Shows highlighted point with red reference dot

**`ReluInteractive.tsx`** (Control inputs):
- Single point evaluator (x → f(x))
- Range controls for X-axis min/max

**Math Rendering**: Uses KaTeX (`react-katex`) for professional equation typesetting in the Equation tab. Import `"katex/dist/katex.min.css"` and use `<BlockMath math="LaTeX syntax" />`.

### Header Component

The sticky header (`components/header.tsx`) implements conditional rendering:
- **Back button**: Only appears on `/blog/[id]` routes (detected via `usePathname()`)
- **Theme toggle**: Always visible in top-right
- Uses `useRouter().back()` for navigation
- Positioned with `fixed top-0 left-0 right-0 z-50`

### Component Architecture (shadcn/ui)

All UI components in `components/ui/` follow the shadcn/ui pattern:
- Built on **Radix UI primitives** for accessibility
- Use **CVA (Class Variance Authority)** for type-safe variants (see Button component)
- Accept `className` prop and merge with `cn()` utility from `lib/utils.ts`
- Use `forwardRef` pattern for DOM element access
- **Composable**: Button's `asChild` prop allows rendering as different elements

**Adding new components**: Use `bunx shadcn@latest add <component-name>` to maintain consistency.

### Routing (Next.js App Router)

- `/`: Home page with blog list (`app/page.tsx`)
- `/blog/[id]`: Dynamic blog post pages (`app/blog/[id]/page.tsx`)
- `app/layout.tsx`: Root layout with Header component applied to all pages

All blog routes are **statically generated** at build time via `generateStaticParams()`.

## Key Technical Patterns

### 1. Hydration Safety Pattern (Theme Toggle)

When accessing browser-only APIs like `localStorage` during SSR:

```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);
if (!mounted) return <FallbackComponent />;
```

This prevents hydration mismatch errors.

### 2. ResizeObserver for Dynamic Animations

Used in `ReluTabs.tsx` to measure tab content heights dynamically:

```typescript
useEffect(() => {
  const resizeObserver = new ResizeObserver(() => {
    // Measure each tab's height and store in state
  });
  refs.forEach(ref => resizeObserver.observe(ref.current));
  return () => resizeObserver.disconnect();
}, []);
```

Then animate the container with Framer Motion: `animate={{ height: heights[activeTab] }}`.

### 3. Class Merging with cn()

Always use `cn()` from `lib/utils.ts` when accepting `className` props:

```typescript
<div className={cn("base-classes", props.className)} />
```

This intelligently merges Tailwind classes and resolves conflicts using `tailwind-merge`.

### 4. Absolute Positioning for Tab Content

In `ReluTabs.tsx`, all tabs render simultaneously but positioned absolutely:

```tsx
<motion.div animate={{ height }} className="relative">
  <TabsContent className="absolute w-full opacity-0" />
  <TabsContent className="absolute w-full opacity-100" />
</motion.div>
```

This allows:
- ResizeObserver to measure all tabs at once
- Smooth height transitions without content jumping
- Opacity-based transitions instead of mount/unmount

### 5. Blog Images

Blog post images are determined by post ID in `BlogListItem.tsx`:
- Alternates between `/image1.png` and `/image2.jpeg` based on blog index
- Used as overlay backgrounds with brightness effects

## Technology Stack

- **Runtime & Package Manager**: Bun
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 (utility-first)
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion (complex) + Tailwind transitions (simple)
- **Math Rendering**: KaTeX + react-katex
- **Charts**: Recharts (built on D3)
- **Code Highlighting**: react-syntax-highlighter (Prism)
- **Icons**: Lucide React
- **Utilities**: CVA, tailwind-merge, clsx

See `STACK.md` for complete dependency list.

## Development Guidelines

1. **Package Management**: Always use Bun for installing packages (`bun add <package>` for dependencies, `bun add -d <package>` for dev dependencies). Never use npm or yarn.

2. **Client Components**: Use `'use client'` directive only when necessary (state, browser APIs, event handlers). Keep server components as default.

3. **Styling**: Use Tailwind utilities exclusively. No CSS modules or styled-components. Use `cn()` for className merging.

4. **Animations**:
   - Simple transitions: Tailwind utilities (`transition-opacity`, `duration-300`)
   - Complex animations: Framer Motion with spring physics

5. **Accessibility**: All components built on Radix UI have keyboard navigation and ARIA labels. Maintain this pattern.

6. **Static Generation**: All blog routes pre-render at build time. No dynamic server-side rendering needed for blog posts.

7. **Theme State**: Managed via direct DOM manipulation (`.dark` class) + localStorage, not React context or state management library.

8. **Type Safety**: Use TypeScript interfaces for all data models. Blog post interface defined in `/lib/blog.ts`.

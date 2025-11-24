'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isBlogPost = pathname !== '/';

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Back button - only show on blog post pages */}
        <div className="w-10">
          {isBlogPost && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Go back"
              className="h-10 w-10 rounded-none shadow-sm hover:bg-muted/50 hover:shadow-md transition-shadow dark:shadow-[0_1px_3px_0_rgba(255,255,255,0.25)] dark:hover:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.3)]"
            />
          )}
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

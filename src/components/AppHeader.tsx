// src/components/AppHeader.tsx
"use client";

import { Logo } from "@/components/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Single Resume" },
  { href: "/bulk-analyzer", label: "Bulk Analyzer" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="py-4 bg-background shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-12 h-12 p-2" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline hidden sm:block">
            ResumeRight
          </h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 rounded-full bg-secondary/80 p-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/"
            className="font-medium transition-colors hover:text-foreground"
          >
            UGEM
          </Link>
          <span>•</span>
          <span>© {new Date().getFullYear()}</span>
          <span>•</span>
          <span>جميع الحقوق محفوظة</span>
        </div>

      </div>
    </footer>
  );
}

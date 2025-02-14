export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-16 h-16 relative animate-pulse">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <div className="absolute inset-2 rounded-full border-2 border-primary border-r-transparent animate-spin" />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-medium text-muted-foreground animate-pulse">
            جاري التحميل...
          </h3>
          <p className="text-sm text-muted-foreground/60">
            يرجى الانتظار قليلاً
          </p>
        </div>
      </div>
    </div>
  );
}

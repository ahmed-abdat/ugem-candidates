import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Background with improved gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-50/80 via-gray-100/50 to-gray-200/80 backdrop-blur-[2px]" />

      {/* Main Content */}
      <main className="relative flex-1 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Card Container with improved glass effect */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
            {children}
          </div>
        </div>
      </main>

      {/* Enhanced Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Primary gradient circle */}
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-primary/20 to-primary/5 blur-3xl animate-pulse" />

        {/* Secondary gradient circle */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-t from-primary/10 to-primary/5 blur-3xl" />

        {/* Accent gradient circle */}
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl" />
      </div>
    </div>
  );
}

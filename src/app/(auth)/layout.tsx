import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50/50 via-gray-100/50 to-gray-200/50">
      {/* Header with Logo */}
      <header className="w-full py-6 px-4 flex justify-center border-b border-gray-200/30 bg-white/50 backdrop-blur-sm">
        <Image
          src="/logo.png"
          alt="شعار"
          width={100}
          height={35}
          className="mx-auto"
          priority
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm border-t border-gray-200/30">
        <p>© {new Date().getFullYear()} UGEM. جميع الحقوق محفوظة</p>
      </footer>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient Circles */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-primary/10 to-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-primary/10 to-primary/5 blur-3xl" />
      </div>
    </div>
  );
}

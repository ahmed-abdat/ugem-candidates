import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإتحاد العام للطلاب الموريتانيين - UGEM",
  description: "المنصة الرسمية للإتحاد العام للطلاب الموريتانيين",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

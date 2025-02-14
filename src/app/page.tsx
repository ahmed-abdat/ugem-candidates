import { ClientOnly } from "@/components/client-only";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { UserWelcome } from "@/components/user-welcome";
import { getCandidates } from "./actions";
import type { Candidate } from "@/components/candidates/columns";

export default async function Home() {
  const { candidates, error } = await getCandidates();

  if (error) {
    return (
      <div className="container py-10">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-red-800">حدث خطأ أثناء جلب البيانات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-white">
      <div className=" py-4 md:py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            منصة الترشح للإنتخابات الطلابية
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            منصة موحدة لإدارة وتنظيم الإنتخابات الطلابية في الإتحاد العام للطلبة
            الموريتانيين
          </p>
        </div>

        {/* User Welcome Section */}
        <ClientOnly>
          <UserWelcome />
        </ClientOnly>

        {/* Candidates Table */}
        <ClientOnly>
          <CandidatesTable
            initialCandidates={(candidates || []) as Candidate[]}
          />
        </ClientOnly>
      </div>
    </div>
  );
}

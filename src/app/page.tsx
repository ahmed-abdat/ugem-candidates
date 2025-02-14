import { ClientOnly } from "@/components/client-only";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { UserWelcome } from "@/components/user-welcome";
import { NumberTicker } from "@/components/ui/animated-count";
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
    <div className="min-h-screen bg-gradient-to-b bg-white">
      <div className="py-4 md:py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            منصة الترشح للإنتخابات الطلابية
          </h1>

          {/* Animated Counter */}
          <div className="flex flex-col items-center justify-center mt-8 space-y-4">
            <div className="flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-sm">
              <NumberTicker
                value={candidates?.length || 0}
                className="text-7xl font-bold tracking-tighter bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent"
              />
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              عدد المنتسبين المسجلين
            </p>
          </div>
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

"use client";

import { UserWelcome } from "@/components/user-welcome";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { NumberTicker } from "@/components/ui/animated-count";
import { useCandidates } from "@/hooks/use-candidates";
import { Loader2, Users } from "lucide-react";

export default function HomePage() {
  const { candidates, isLoading, error } = useCandidates();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <UserWelcome />

      {/* Stats Section */}
      <div className="relative overflow-hidden rounded-3xl border bg-white/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative py-4 px-3 md:p-4 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                إحصائيات المنتسبين
              </h2>
              <p className="text-muted-foreground">
                تابع آخر إحصائيات المنتسبين في النظام
              </p>
            </div>
          </div>

          {/* Stats Counter */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border w-full max-w-md">
              <NumberTicker
                value={candidates.length}
                isLoading={isLoading}
                label="منتسب مسجل في النظام"
              />
            </div>
          </div>

          {/* Candidates Table */}
          <div className="relative rounded-2xl border bg-white/80 backdrop-blur-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive p-12">{error}</div>
            ) : (
              <CandidatesTable initialCandidates={candidates} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

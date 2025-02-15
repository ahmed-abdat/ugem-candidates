"use client";

import Link from "next/link";
import { ArrowLeft, UserPlus, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";
import { useUserCandidate } from "@/hooks/use-user-candidate";

export function UserWelcome() {
  const { user } = useUserStore();
  const { hasCandidate } = useUserCandidate(user?.id);

  return (
    <div className="relative isolate">
      {/* Gradient background */}
      <div className="absolute inset-x-0 top-20 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/50 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            منصة الأعضاء المنتسبين للاتحاد العام للطلاب الموريتانيين{" "}
            <span className="text-primary">UGEM</span>
          </h1>

          {user ? (
            <>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                {hasCandidate ? (
                  <>
                    مرحباً بك{" "}
                    <span className="text-primary">{user.first_name}</span> !
                    لقد قمت بالفعل بتسجيل بياناتك كمنتسب.
                  </>
                ) : (
                  <>
                    مرحباً بك{" "}
                    <span className="text-primary">{user.first_name}</span> ! قم
                    بتسجيل بياناتك كمنتسب في الاتحاد العام للطلاب الموريتانيين.
                  </>
                )}
              </p>

              <div className="mt-10 flex items-center justify-center">
                {!hasCandidate && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-200 group min-w-[200px]"
                  >
                    <Link
                      href="/candidate/register"
                      className="flex items-center gap-2"
                    >
                      تسجيل منتسب
                      <FileEdit className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                قم بتسجيل الدخول للانضمام إلى{" "}
                <span className="text-primary">عائلتك</span> في الاتحاد العام
                للطلاب الموريتانيين <span className="text-primary">(UGEM)</span>
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-200 group min-w-[160px]"
                >
                  <Link href="/login" className="flex items-center gap-2">
                    تسجيل الدخول
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-200 group min-w-[160px]"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    إنشاء حساب
                    <UserPlus className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-primary/50 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}

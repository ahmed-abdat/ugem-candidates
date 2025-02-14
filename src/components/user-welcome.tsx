"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userStorage } from "@/lib/storage";
import { useUserCandidate } from "@/hooks/use-user-candidate";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function UserWelcome() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { hasCandidate } = useUserCandidate(userData?.id);

  useEffect(() => {
    const user = userStorage.getUser();
    setUserData(user);
  }, []);

  if (userData) {
    return (
      <div className="relative overflow-hidden rounded-3xl border bg-white/50 backdrop-blur-sm p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent sm:text-5xl">
              مرحباً بك {userData.first_name} {userData.last_name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نحن سعداء بانضمامك إلى عائلة الاتحاد العام للطلاب الموريتانيين
            </p>
          </div>

          {!hasCandidate && (
            <div className="relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-8 text-center space-y-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />
              <div className="relative space-y-4">
                <h2 className="text-xl font-semibold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  قم بتسجيل منتسب جديد للمشاركة في الإنتخابات
                </h2>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-200 group"
                >
                  <Link
                    href="/candidate/register"
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                    تسجيل منتسب
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-white/50 backdrop-blur-sm p-8 md:p-12">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="relative space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent sm:text-5xl max-w-3xl mx-auto leading-tight">
            منصة أعضاء المنتسبين للاتحاد العام للطلاب الموريتانيين (UGEM)
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            قم بتسجيل الدخول للانضمام إلى عائلتك في الاتحاد العام للطلاب
            الموريتانيين (UGEM)
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-8 text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />
          <div className="relative space-y-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              قم بتسجيل الدخول للمشاركة في الإنتخابات
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-200 group w-full sm:w-auto"
              >
                <Link href="/login" className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                  تسجيل الدخول
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="hover:bg-primary/5 hover:text-primary hover:border-primary transition-all duration-200 group w-full sm:w-auto"
              >
                <Link href="/register" className="flex items-center gap-2">
                  <User className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  إنشاء حساب
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, User, UserPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userStorage } from "@/lib/storage";
import { getUserCandidates } from "@/app/actions";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function UserWelcome() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCandidate, setHasCandidate] = useState(false);

  useEffect(() => {
    async function init() {
      const user = userStorage.getUser();
      setUserData(user);

      if (user) {
        try {
          const { candidates } = await getUserCandidates(user.id);
          setHasCandidate(Boolean(candidates && candidates.length > 0));
        } catch (error) {
          console.error("Error checking candidate:", error);
        }
      }

      setIsLoading(false);
    }

    init();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <div className="flex items-center justify-center min-h-[100px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        </div>
      </div>
    );
  }

  if (!userData)
    return (
      <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">
          قم بتسجيل الدخول للمشاركة في الإنتخابات
        </h2>
        <div className="flex gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            <Link href="/login">
              تسجيل الدخول
              <ArrowRight className="w-4 h-4 mr-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="hover:bg-primary/5 hover:text-primary hover:border-primary transition-all duration-200"
          >
            <Link href="/register">
              إنشاء حساب
              <User className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            مرحباً بك، {userData.first_name}
          </h2>
          <p className="text-muted-foreground">
            {hasCandidate
              ? "يمكنك إدارة حسابك وتعديل بياناتك من خلال الملف الشخصي"
              : "نحن سعداء بمشاركتك في الإنتخابات الطلابية"}
          </p>
        </div>
        {hasCandidate ? (
          <Button
            asChild
            size="lg"
            variant="outline"
            className="hover:bg-primary/5 hover:text-primary hover:border-primary transition-all duration-200 gap-2"
          >
            <Link href="/profile">
              إدارة الملف الشخصي
              <Settings className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-200 gap-2"
          >
            <Link href="/candidate/register">
              تسجيل الإنتساب
              <UserPlus className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

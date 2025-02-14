"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { userStorage } from "@/lib/storage";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function UserWelcome() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const user = userStorage.getUser();
    setUserData(user);
    setIsLoading(false);
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

  if (!userData) return (
        <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold">
            قم بتسجيل الدخول للمشاركة في الإنتخابات
          </h2>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link href="/login">
                تسجيل الدخول
                <ArrowRight className="w-4 h-4 mr-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">
                إنشاء حساب
                <User className="w-4 h-4 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
  );

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            مرحباً بك، {userData.first_name}
          </h2>
          <p className="text-muted-foreground">
            نحن سعداء بمشاركتك في الإنتخابات الطلابية
          </p>
        </div>
        {!hasSubmitted ? (
          <Button asChild size="lg" className="gap-2">
            <Link href="/candidate/register">
              تسجيل الترشح
              <UserPlus className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Alert>
            <AlertDescription>لقد قمت بتسجيل ترشحك مسبقاً</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

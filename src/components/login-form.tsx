"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { LoginFormValues, loginSchema } from "@/lib/validations/login";
import { loginUser } from "@/app/actions";
import { cn } from "@/lib/utils";
import { userStorage } from "@/lib/storage";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store";

interface AuthMessageProps {
  type: "error" | "success";
  message: string | null;
}

function AuthMessage({ type, message }: AuthMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "rounded-md p-3 text-sm",
        type === "error"
          ? "bg-destructive/15 text-destructive"
          : "bg-emerald-500/15 text-emerald-500"
      )}
    >
      {message}
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      setError(null);
      setIsPending(true);

      const result = await loginUser(values);

      if (result?.error) {
        // Handle specific Firebase auth errors
        if (result.error.includes("auth/user-not-found")) {
          setError("البريد الإلكتروني غير مسجل");
          toast.error("البريد الإلكتروني غير مسجل");
          return;
        }
        if (result.error.includes("auth/wrong-password")) {
          setError("كلمة المرور غير صحيحة");
          toast.error("كلمة المرور غير صحيحة");
          return;
        }
        if (result.error.includes("auth/invalid-email")) {
          setError("البريد الإلكتروني غير صالح");
          toast.error("البريد الإلكتروني غير صالح");
          return;
        }
        if (result.error.includes("auth/too-many-requests")) {
          setError("تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقاً");
          toast.error(
            "تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقاً"
          );
          return;
        }

        // For any other errors
        setError(result.error);
        toast.error(result.error);
        return;
      }

      if (result?.success && result.user) {
        useUserStore.getState().setUser(result.user);
        toast.success("تم تسجيل الدخول بنجاح");
        router.replace("/");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
      toast.error("حدث خطأ ما");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-card rounded-lg shadow-sm">
      {/* Logo */}
      <div className="flex justify-center pt-6">
        <Image
          src="/logo.png"
          alt="UGEM Logo"
          width={120}
          height={120}
          className="mb-2"
          priority
        />
      </div>

      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">تسجيل الدخول</h1>
        <p className="text-sm text-muted-foreground">
          أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول
        </p>
      </div>

      <AuthMessage type="error" message={error} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-6 pb-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input
                    className="h-9 text-right"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">كلمة المرور</FormLabel>
                <FormControl>
                  <PasswordInput
                    className="h-9 text-right"
                    placeholder="أدخل كلمة المرور"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-9 bg-primary/90 hover:bg-primary text-sm"
            disabled={isPending}
          >
            {isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                تسجيل الدخول
                <ArrowRight className="mr-2 h-3.5 w-3.5 rotate-180" />
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              ليس لديك حساب؟{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                إنشاء حساب
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

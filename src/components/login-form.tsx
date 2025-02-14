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
      console.log("Login result:", result);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.success && result.user) {
        console.log("Storing user data:", result.user);
        userStorage.setUser(result.user);
        router.replace("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/logo.png"
          alt="UGEM Logo"
          width={120}
          height={120}
          className="mb-2"
          priority
        />
      </div>

      <div className="flex flex-col space-y-1.5 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          تسجيل الدخول
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول
        </p>
      </div>

      <AuthMessage type="error" message={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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

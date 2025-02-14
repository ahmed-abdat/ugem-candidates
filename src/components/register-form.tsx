"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { RegisterFormValues, registerSchema } from "@/lib/validations/register";
import { isUserExist, signupUser } from "@/app/actions";
import { cn } from "@/lib/utils";

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

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setError(null);
      setIsPending(true);

      const userExists = await isUserExist(values.email);

      if (userExists?.id) {
        setError("البريد الإلكتروني مستخدم بالفعل");
        return;
      }

      const result = await signupUser(values);
      if (result?.error) {
        setError(result.error);
        console.log(result.error);
        return;
      }

      router.replace("/login");
    } catch (error) {
      console.log(error);
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-1.5 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          إنشاء حساب جديد
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          أدخل بياناتك لإنشاء حساب جديد
        </p>
      </div>

      <AuthMessage type="error" message={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">الاسم الأول</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 text-right"
                      placeholder="أدخل اسمك الأول"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">اسم العائلة</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 text-right"
                      placeholder="أدخل اسم العائلة"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

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
                إنشاء حساب
                <ArrowRight className="mr-2 h-3.5 w-3.5 rotate-180" />
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

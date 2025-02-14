import { LoginForm } from "@/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - الإتحاد العام للطلبة الموريتانيين",
  description:
    "تسجيل الدخول إلى حسابك في المنصة الرسمية للإتحاد العام للطلبة الموريتانيين",
};

export default function LoginPage() {
  return <LoginForm />;
}

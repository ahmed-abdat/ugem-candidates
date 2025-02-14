import { CandidateForm } from "@/components/candidate-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل مرشح جديد - الإتحاد العام للطلبة الموريتانيين",
  description:
    "تسجيل مرشح جديد في المنصة الرسمية للإتحاد العام للطلبة الموريتانيين",
};

export default function CandidateRegisterPage() {
  return <CandidateForm />;
}

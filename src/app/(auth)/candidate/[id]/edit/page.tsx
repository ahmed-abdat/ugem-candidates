import { CandidateForm } from "@/components/candidate-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تعديل بيانات المرشح - الإتحاد العام للطلبة الموريتانيين",
  description:
    "تعديل بيانات المرشح في المنصة الرسمية للإتحاد العام للطلبة الموريتانيين",
};

interface EditCandidatePageProps {
  params: {
    id: string;
  };
}

export default function EditCandidatePage({ params }: EditCandidatePageProps) {
  return (
    <div className="px-4 py-8 sm:px-6">
      <CandidateForm mode="edit" candidateId={params.id} />
    </div>
  );
}

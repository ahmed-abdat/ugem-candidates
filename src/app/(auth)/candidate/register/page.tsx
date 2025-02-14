"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CandidateForm } from "@/components/candidate-form";
import { getUserCandidates } from "@/app/actions";
import { userStorage } from "@/lib/storage";
import { toast } from "sonner";

export default function CandidateRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkExistingCandidate() {
      const user = userStorage.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const { candidates, error } = await getUserCandidates(user.id);

        if (error) {
          console.error("Error checking candidates:", error);
          return;
        }

        if (candidates && candidates.length > 0) {
          toast.error("لقد إنتسبتم بالفعل", {
            description: "لا يمكن إنشاء أكثر من حساب منتسب واحد",
          });
          router.replace("/profile");
        }
      } catch (error) {
        console.error("Error checking candidates:", error);
      }
    }

    checkExistingCandidate();
  }, [router]);

  return <CandidateForm />;
}

"use server";

import { db } from "@/config/firebase";
import { collection, doc, addDoc, getDoc, updateDoc } from "firebase/firestore";
import type { CandidateFormValues } from "@/lib/validations/candidate";

interface ActionResponse {
  error?: string;
  success?: boolean;
  data?: any;
}

export async function handleCandidateSubmit(
  values: CandidateFormValues,
  userId: string,
  mode: "create" | "edit" = "create",
  candidateId?: string
): Promise<ActionResponse> {
  try {
    if (!userId) {
      return { error: "يجب تسجيل الدخول" };
    }

    // Validate faculty selection
    if (!values.faculty || !values.faculty.trim()) {
      return { error: "يجب اختيار الكلية" };
    }

    const candidateData = {
      ...values,
      creator_id: userId,
      updated_at: new Date().toISOString(),
    };

    if (mode === "edit" && candidateId) {
      // Check permissions first
      const candidateRef = doc(db, "candidates", candidateId);
      const candidateSnap = await getDoc(candidateRef);

      if (!candidateSnap.exists()) {
        return { error: "المرشح غير موجود" };
      }

      const existingData = candidateSnap.data();
      if (existingData.creator_id !== userId) {
        return { error: "ليس لديك صلاحية تعديل هذا المرشح" };
      }

      // Update the candidate
      await updateDoc(candidateRef, {
        ...candidateData,
        updated_at: new Date().toISOString(),
      });

      return {
        success: true,
        data: { id: candidateId },
      };
    } else {
      // Create new candidate
      const docRef = await addDoc(collection(db, "candidates"), {
        ...candidateData,
        created_at: new Date().toISOString(),
      });

      return {
        success: true,
        data: { id: docRef.id },
      };
    }
  } catch (error) {
    console.error("Error handling candidate submit:", error);
    return {
      error:
        error instanceof Error ? error.message : "حدث خطأ أثناء معالجة الطلب",
    };
  }
}

export async function getCandidate(candidateId: string) {
  try {
    const candidateRef = doc(db, "candidates", candidateId);
    const candidateSnap = await getDoc(candidateRef);

    const candidateData = candidateSnap.data() as CandidateFormValues;
    return candidateData;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return null;
  }
}

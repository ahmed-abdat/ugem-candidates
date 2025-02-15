"use server";

import { db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { auth } from "@/config/firebase";
import type { RegisterFormValues } from "@/lib/validations/register";
import type { LoginFormValues } from "@/lib/validations/login";
import type { CandidateFormValues } from "@/lib/validations/candidate";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export async function isUserExist(email: string) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0]?.data() as UserData | undefined;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Failed to check user existence");
  }
}

export async function signupUser(values: RegisterFormValues) {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    // Create a user document in Firestore
    const userDoc = doc(db, "users", userCredential.user.uid);
    const userData: UserData = {
      id: userCredential.user.uid,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(userDoc, userData);

    return { success: true, user: userData };
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function loginUser(values: LoginFormValues) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    // Get user data from Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("id", "==", userCredential.user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data() as UserData;
      return { success: true, user: userData };
    }

    return { error: "لم يتم العثور على بيانات المستخدم" };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    };
  }
}

export async function createCandidate(
  values: CandidateFormValues,
  userId: string
) {
  try {
    if (!userId) {
      return { error: "يجب تسجيل الدخول لإنشاء مرشح" };
    }

    // Add the candidate to Firestore
    const docRef = await addDoc(collection(db, "candidates"), {
      ...values,
      creator_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating candidate:", error);
    return {
      error: error instanceof Error ? error.message : "فشل في إنشاء المرشح",
    };
  }
}

export async function checkCandidatePermission(
  candidateId: string,
  userId: string
) {
  try {
    const candidateRef = doc(db, "candidates", candidateId);
    const candidateSnap = await getDoc(candidateRef);

    if (!candidateSnap.exists()) {
      return { error: "المرشح غير موجود" };
    }

    const candidateData = candidateSnap.data();
    return { hasPermission: candidateData.creator_id === userId };
  } catch (error) {
    console.error("Error checking permissions:", error);
    return { error: "فشل في التحقق من الصلاحيات" };
  }
}

export async function updateCandidate(
  candidateId: string,
  userId: string,
  values: Partial<CandidateFormValues>
) {
  console.log("Attempting to update candidate:", {
    candidateId,
    userId,
    values,
  });

  try {
    const permission = await checkCandidatePermission(candidateId, userId);
    console.log("Update permission check result:", permission);

    if (permission.error) {
      console.log("Update permission error:", permission.error);
      return { error: permission.error };
    }

    if (!permission.hasPermission) {
      console.log("Update permission denied for user:", userId);
      return { error: "ليس لديك صلاحية تعديل هذا المرشح" };
    }

    const candidateRef = doc(db, "candidates", candidateId);
    await updateDoc(candidateRef, {
      ...values,
      updated_at: new Date().toISOString(),
    });

    console.log("Candidate updated successfully:", candidateId);
    return { success: true };
  } catch (error) {
    console.error("Error updating candidate:", error);
    return {
      error: error instanceof Error ? error.message : "فشل في تحديث المرشح",
    };
  }
}

export async function deleteCandidate(candidateId: string, userId: string) {
  console.log("Deleting candidate:", { candidateId, userId });

  try {
    if (!userId) {
      return { error: "يجب تسجيل الدخول لحذف المرشح" };
    }

    // Check permissions
    const candidateRef = doc(db, "candidates", candidateId);
    const candidateSnap = await getDoc(candidateRef);

    if (!candidateSnap.exists()) {
      return { error: "المرشح غير موجود" };
    }

    const candidateData = candidateSnap.data();
    if (candidateData.creator_id !== userId) {
      return { error: "ليس لديك صلاحية حذف هذا المرشح" };
    }

    // Delete the candidate
    await deleteDoc(candidateRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return {
      error: error instanceof Error ? error.message : "فشل في حذف المرشح",
    };
  }
}

export async function getCandidates() {
  try {
    const candidatesRef = collection(db, "candidates");
    const q = query(candidatesRef, orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);

    const candidatesData: any[] = [];
    querySnapshot.forEach((doc) => {
      candidatesData.push({ id: doc.id, ...doc.data() });
    });

    return { candidates: candidatesData };
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return { error: "Failed to fetch candidates" };
  }
}

export async function getUserCandidates(userId: string) {
  console.log("Fetching user candidates for user:", userId);
  if (!userId) {
    return { error: "يجب تسجيل الدخول لإرجاع المرشحات" };
  }
  try {
    const candidatesRef = collection(db, "candidates");
    const q = query(
      candidatesRef,
      where("creator_id", "==", userId),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);

    const candidatesData: any[] = [];
    querySnapshot.forEach((doc) => {
      candidatesData.push({ id: doc.id, ...doc.data() });
    });

    return { candidates: candidatesData };
  } catch (error) {
    console.error("Error fetching user candidates:", error);
    return { error: "Failed to fetch candidates" };
  }
}

export async function updateUser(
  userId: string,
  data: {
    first_name: string;
    last_name: string;
  }
) {
  console.log("Updating user:", { userId, data });

  try {
    if (!userId) {
      return { error: "يجب تسجيل الدخول لتحديث البيانات" };
    }

    // Validate input data
    if (!data.first_name || !data.last_name) {
      return { error: "جميع الحقول مطلوبة" };
    }

    if (data.first_name.length < 2 || data.last_name.length < 2) {
      return { error: "يجب أن يتكون كل اسم من حرفين على الأقل" };
    }

    // Check if user exists
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { error: "المستخدم غير موجود" };
    }

    // Update user data
    await updateDoc(userRef, {
      first_name: data.first_name,
      last_name: data.last_name,
      updated_at: new Date().toISOString(),
    });

    // Get updated user data
    const updatedUserSnap = await getDoc(userRef);
    const userData = updatedUserSnap.data();

    return {
      success: true,
      user: {
        id: userId,
        ...userData,
      },
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      error: error instanceof Error ? error.message : "فشل في تحديث البيانات",
    };
  }
}

export async function deleteUserAccount(user: UserData) {
  if (!user) {
    return { error: "لا يوجد مستخدم" };
  }
  console.log("Deleting user:", user);
  const userId = user.id;
  try {
    // Delete user's candidates first
    const candidatesRef = collection(db, "candidates");
    const q = query(candidatesRef, where("creator_id", "==", userId));
    const querySnapshot = await getDocs(q);

    // Delete all candidates in a batch
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Delete user document from Firestore
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);

    // Delete user from Firebase Auth
    const user = auth.currentUser;
    console.log("Deleting user:", user);
    if (user) {
      await deleteUser(user);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete account",
    };
  }
}

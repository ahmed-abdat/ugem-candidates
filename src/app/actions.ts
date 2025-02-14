"use server";

import { db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { auth } from "@/config/firebase";
import type { RegisterFormValues } from "@/lib/validations/register";
import type { LoginFormValues } from "@/lib/validations/login";
import type { CandidateFormValues } from "@/lib/validations/candidate";

export async function isUserExist(email: string) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs[0]?.data();
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
    await setDoc(userDoc, {
      id: userCredential.user.uid,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return { success: true };
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
    const userDoc = doc(db, "users", userCredential.user.uid);
    const userData = await getDocs(
      query(collection(db, "users"), where("id", "==", userCredential.user.uid))
    );

    if (!userData.empty) {
      return { success: true, user: userData.docs[0].data() };
    }

    return { error: "لم يتم العثور على بيانات المستخدم" };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    };
  }
}

export async function createCandidate(values: CandidateFormValues) {
  try {
    // Add the candidate to Firestore
    const docRef = await addDoc(collection(db, "candidates"), {
      ...values,
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

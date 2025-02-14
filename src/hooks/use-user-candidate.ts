import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Candidate } from "@/components/candidates/columns";

export function useUserCandidate(userId: string | undefined) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setCandidate(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Create a query to get user's single candidate
    const q = query(
      collection(db, "candidates"),
      where("creator_id", "==", userId),
      limit(1) // We only need one candidate
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setCandidate(null);
        } else {
          const doc = snapshot.docs[0];
          setCandidate({ id: doc.id, ...doc.data() } as Candidate);
        }
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching user candidate:", error);
        setError("Failed to fetch user candidate");
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  return {
    candidate,
    isLoading,
    error,
    hasCandidate: !!candidate,
  };
}

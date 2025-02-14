import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Candidate } from "@/components/candidates/columns";

export function useUserCandidates(userId: string | undefined) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setCandidates([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Create a query to get user's candidates ordered by creation date
    const q = query(
      collection(db, "candidates"),
      where("creator_id", "==", userId),
      orderBy("created_at", "desc")
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const candidatesData: Candidate[] = [];
        snapshot.forEach((doc) => {
          candidatesData.push({ id: doc.id, ...doc.data() } as Candidate);
        });
        setCandidates(candidatesData);
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching user candidates:", error);
        setError("Failed to fetch user candidates");
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  return {
    candidates,
    isLoading,
    error,
    hasCandidate: candidates.length > 0,
  };
}

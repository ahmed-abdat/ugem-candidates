import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Candidate } from "@/components/candidates/columns";

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    // Create a query to get candidates ordered by creation date
    const q = query(
      collection(db, "candidates"),
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
        console.error("Error fetching candidates:", error);
        setError("Failed to fetch candidates");
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { candidates, isLoading, error };
}

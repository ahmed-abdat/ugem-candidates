"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { columns, type Candidate } from "@/components/candidates/columns";
import { DataTable } from "@/components/candidates/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CandidatesTableProps {
  initialCandidates: Candidate[];
}

export function CandidatesTable({ initialCandidates }: CandidatesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debug log for initial data
  useEffect(() => {
    console.log("Initial candidates:", initialCandidates);
  }, [initialCandidates]);

  // Get candidate ID from URL query
  const candidateId = searchParams.get("candidate");

  // Debug log for URL params
  useEffect(() => {
    console.log("Current URL params:", {
      candidateId,
      allParams: Object.fromEntries(searchParams.entries()),
    });
  }, [candidateId, searchParams]);

  // Find the selected candidate from the ID in URL
  const selectedCandidate = useMemo(() => {
    if (!candidateId) return null;
    const found = initialCandidates.find((c) => c.id === candidateId);
    console.log("Selected candidate:", found || "Not found");
    return found || null;
  }, [candidateId, initialCandidates]);

  // Handle opening and closing the modal through URL
  const handleView = useCallback(
    (candidate: Candidate) => {
      console.log("handleView called with candidate:", candidate.id);

      // Create a new URLSearchParams with current params
      const params = new URLSearchParams();

      // Copy over existing params
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });

      // Add the candidate ID
      params.set("candidate", candidate.id);

      const newUrl = `?${params.toString()}`;
      console.log("Updating URL to:", newUrl);

      router.push(newUrl);
    },
    [router, searchParams]
  );

  const handleCloseModal = useCallback(() => {
    console.log("handleCloseModal called");

    // Create a new URLSearchParams with current params
    const params = new URLSearchParams();

    // Copy over existing params
    searchParams.forEach((value, key) => {
      if (key !== "candidate") {
        params.set(key, value);
      }
    });

    const newUrl = `?${params.toString()}`;
    console.log("Updating URL to:", newUrl);

    router.push(newUrl);
  }, [router, searchParams]);

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">المرشحون</h2>
            <p className="text-muted-foreground">
              قائمة بجميع المرشحين المسجلين في النظام
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {initialCandidates.length} مرشح مسجل
            </p>
          </div>
          <DataTable
            columns={columns}
            data={initialCandidates}
            meta={{
              onView: handleView,
            }}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedCandidate}
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange:", { open });
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-2">
              تفاصيل المرشح
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              معلومات كاملة عن المرشح وبياناته الشخصية
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-8">
              {/* Candidate Image */}
              <div className="flex flex-col items-center gap-4">
                {selectedCandidate.image_url ? (
                  <div className="relative h-40 w-40 rounded-full ring-4 ring-primary/10">
                    <Image
                      src={selectedCandidate.image_url}
                      alt={selectedCandidate.full_name}
                      className="rounded-full object-cover"
                      fill
                      sizes="160px"
                      priority
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center ring-4 ring-primary/10">
                    <span className="text-muted-foreground text-sm">
                      لا توجد صورة
                    </span>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-center">
                  {selectedCandidate.full_name}
                </h2>
              </div>

              {/* Candidate Details */}
              <div className="grid grid-cols-2 gap-6 bg-muted/50 rounded-lg p-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground text-sm">
                    رقم الهاتف
                  </h4>
                  <p className="text-lg font-medium">
                    {selectedCandidate.phone}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground text-sm">
                    التخصص
                  </h4>
                  <p className="text-lg font-medium">
                    {selectedCandidate.specialty}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground text-sm">
                    الكلية
                  </h4>
                  <p className="text-lg font-medium">
                    {selectedCandidate.faculty}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground text-sm">
                    تاريخ التسجيل
                  </h4>
                  <p className="text-lg font-medium">
                    {new Date(selectedCandidate.created_at).toLocaleDateString(
                      "ar-MA",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div className="col-span-2 space-y-2">
                  <h4 className="font-medium text-muted-foreground text-sm">
                    العنوان
                  </h4>
                  <p className="text-lg font-medium">
                    {selectedCandidate.address}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

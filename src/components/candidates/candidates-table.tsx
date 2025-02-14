"use client";

import { useState } from "react";
import { columns, type Candidate } from "@/components/candidates/columns";
import { DataTable } from "@/components/candidates/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

interface CandidatesTableProps {
  initialCandidates: Candidate[];
}

export function CandidatesTable({ initialCandidates }: CandidatesTableProps) {
  // Local state for modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  // Handle opening the modal
  const handleView = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedCandidate(null);
  };

  return (
    <>
      <div className="rounded-2xl border bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="p-2 md:p-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              المنتسبين
            </h2>
            <p className="text-sm text-muted-foreground">
              {initialCandidates.length} منتسب مسجل في النظام
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
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center mb-2">
                  تفاصيل المنتسب
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  المعلومات الشخصية للمنتسب
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8">
                {/* Candidate Image */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-40 w-40 rounded-full ring-4 ring-primary/10">
                    <Image
                      src={
                        selectedCandidate.image_url || "/default_avatar.jpeg"
                      }
                      alt={selectedCandidate.full_name}
                      className="rounded-full object-cover"
                      fill
                      sizes="160px"
                      priority
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-center bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
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
                      {new Date(
                        selectedCandidate.created_at
                      ).toLocaleDateString("ar-MA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

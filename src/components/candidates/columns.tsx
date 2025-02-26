"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";

export type Candidate = {
  id: string;
  full_name: string;
  phone: string;
  specialty: string;
  faculty: string;
  address: string;
  image_url?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
};

interface ActionsProps {
  candidate: Candidate;
  onView?: (candidate: Candidate) => void;
}

function Actions({ candidate, onView }: ActionsProps) {
  const handleClick = () => {
    console.log("Action: View button clicked for candidate:", candidate.id);
    if (onView) {
      onView(candidate);
    } else {
      console.log("Warning: onView handler is not provided");
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
      onClick={handleClick}
    >
      <Eye className="h-4 w-4" />
      <span>عرض</span>
    </Button>
  );
}

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "image_url",
    header: "الصورة",
    cell: ({ row }) => {
      const image_url = row.getValue("image_url") as string;
      return (
        <div className="flex items-center justify-center">
          {image_url ? (
            <div className="relative h-10 w-10">
              <Image
                src={image_url}
                alt="صورة المرشح"
                className="rounded-full object-cover ring-2 ring-primary/10"
                fill
                sizes="40px"
              />
            </div>
          ) : (
            <div className="relative h-10 w-10">
              <Image
                src="/default_avatar.jpeg"
                alt="Default Avatar"
                className="rounded-full object-cover ring-2 ring-primary/10"
                fill
                sizes="40px"
              />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "الاسم الكامل",
    cell: ({ row }) => {
      return (
        <div className="font-medium pr-2">{row.getValue("full_name")}</div>
      );
    },
  },
  {
    accessorKey: "specialty",
    header: "التخصص",
    cell: ({ row }) => {
      return <div className="pr-2">{row.getValue("specialty")}</div>;
    },
  },
  {
    accessorKey: "faculty",
    header: "الكلية",
    cell: ({ row }) => {
      return <div className="pr-2">{row.getValue("faculty")}</div>;
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row, table }) => {
      const candidate = row.original;
      // @ts-ignore - We know these props exist on the table
      const { onView } = table.options.meta || {};

      return (
        <ClientOnly>
          <div className="flex justify-center">
            <Actions candidate={candidate} onView={onView} />
          </div>
        </ClientOnly>
      );
    },
  },
];

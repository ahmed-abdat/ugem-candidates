"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CandidateFormValues,
  candidateSchema,
} from "@/lib/validations/candidate";
import { createCandidate } from "@/app/actions";
import { cn } from "@/lib/utils";

interface AuthMessageProps {
  type: "error" | "success";
  message: string | null;
}

function AuthMessage({ type, message }: AuthMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "rounded-md p-3 text-sm",
        type === "error"
          ? "bg-destructive/15 text-destructive"
          : "bg-emerald-500/15 text-emerald-500"
      )}
    >
      {message}
    </div>
  );
}

export function CandidateForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      specialty: "",
      faculty: "",
      address: "",
      image_url: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("فشل في رفع الصورة");
    }
  }

  async function onSubmit(values: CandidateFormValues) {
    try {
      setError(null);
      setIsPending(true);

      // Upload image if selected
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        values.image_url = imageUrl;
      }

      const result = await createCandidate(values);
      if (result?.error) {
        setError(result.error);
        return;
      }

      // Redirect to success page
      router.replace("/success");
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          تسجيل مرشح جديد
        </h1>
        <p className="text-sm text-muted-foreground">
          أدخل بيانات المرشح لإنشاء ملف جديد
        </p>
      </div>

      <AuthMessage type="error" message={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <FormLabel className="text-sm">الصورة (اختياري)</FormLabel>
            <div className="flex items-center justify-center">
              <label
                htmlFor="image-upload"
                className={cn(
                  "relative flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
                  "hover:border-primary/50 hover:bg-primary/5",
                  previewUrl ? "border-primary" : "border-muted-foreground/25"
                )}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      اختر صورة
                    </span>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">الإسم الكامل</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 text-right transition-colors focus:border-primary"
                      placeholder="أدخل الإسم الكامل"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 text-right transition-colors focus:border-primary"
                      type="tel"
                      placeholder="أدخل رقم الهاتف"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">الكلية</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 text-right transition-colors focus:border-primary"
                      placeholder="أدخل اسم الكلية"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">التخصص</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 text-right transition-colors focus:border-primary"
                      placeholder="أدخل التخصص"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">عنوان السكن</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 text-right transition-colors focus:border-primary"
                      placeholder="أدخل عنوان السكن"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 mt-6 bg-primary hover:bg-primary/90 text-sm font-medium transition-colors"
            disabled={isPending}
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                إنشاء مرشح
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

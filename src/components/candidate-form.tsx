"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CandidateFormValues,
  candidateSchema,
} from "@/lib/validations/candidate";
import { getCandidate, handleCandidateSubmit } from "@/app/actions/candidate";
import { cn } from "@/lib/utils";
import { userStorage } from "@/lib/storage";

const faculties = [
  { value: "كلية العلوم", label: "كلية العلوم" },
  { value: "كلية الاقتصاد", label: "كلية الاقتصاد" },
  { value: "كلية الأداب", label: "كلية الأداب" },
  { value: "كلية الطب", label: "كلية الطب" },
  { value: "ISCAE", label: "ISCAE" },
  { value: "SupNum", label: "SupNum" },
] as const;

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

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface CandidateFormProps {
  mode?: "create" | "edit";
  candidateId?: string;
}

export function CandidateForm({
  mode = "create",
  candidateId,
}: CandidateFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      specialty: "",
      faculty: "",
      address: "",
      image_url: "",
      creator_id: "",
    },
    mode: "onSubmit",
  });

  // Get user data from storage on client side only
  useEffect(() => {
    const user = userStorage.getUser();
    if (user) {
      setUserData(user);
      // Only set the full name for new candidates
      if (mode === "create") {
        form.setValue("full_name", `${user.first_name} ${user.last_name}`);
      }
    } else {
      router.replace("/login");
    }
  }, [form, router, mode]);

  // Fetch candidate data in edit mode
  useEffect(() => {
    const fetchCandidateData = async () => {
      if (mode === "edit" && candidateId) {
        try {
          setIsPending(true);
          const candidateData = await getCandidate(candidateId);

          if (!candidateData) {
            setError("المرشح غير موجود");
            router.push("/profile");
            return;
          }

          // Check permission
          const user = userStorage.getUser();
          if (!user || candidateData.creator_id !== user.id) {
            setError("ليس لديك صلاحية تعديل هذا المرشح");
            router.push("/profile");
            return;
          }

          // Set preview URL if image exists
          if (candidateData.image_url) {
            setPreviewUrl(candidateData.image_url);
          }

          // Reset form with candidate data
          form.reset({
            full_name: candidateData.full_name,
            phone: candidateData.phone,
            specialty: candidateData.specialty,
            faculty: candidateData.faculty,
            address: candidateData.address,
            image_url: candidateData.image_url,
            creator_id: candidateData.creator_id,
          });
        } catch (error) {
          console.error("Error fetching candidate:", error);
          setError("حدث خطأ أثناء جلب بيانات المرشح");
          router.push("/profile");
        } finally {
          setIsPending(false);
        }
      }
    };

    fetchCandidateData();
  }, [candidateId, mode, router, form]);

  // Show loading state while checking authentication
  if (typeof window !== "undefined" && !userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

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

      if (!userData) {
        setError("يجب تسجيل الدخول");
        return;
      }

      // Add creator_id to the form values
      const candidateData = {
        ...values,
        creator_id: userData.id,
      };

      // Upload image if selected
      if (imageFile) {
        try {
          const imageUrl = await uploadImage(imageFile);
          candidateData.image_url = imageUrl;
        } catch (uploadError) {
          setError("فشل في رفع الصورة");
          return;
        }
      }

      // Use the new action
      const result = await handleCandidateSubmit(
        candidateData,
        userData.id,
        mode,
        mode === "edit" ? candidateId : undefined
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      // Navigate based on mode
      if (mode === "edit") {
        router.push("/profile");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 bg-card rounded-lg shadow-sm">
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/logo.png"
          alt="UGEM Logo"
          width={120}
          height={120}
          className="mb-2"
          priority
        />
      </div>

      <AuthMessage type="error" message={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <FormLabel className="text-sm">الصورة الشخصية (اختياري)</FormLabel>
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
                  <div className="relative w-32 h-32">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                      sizes="128px"
                    />
                  </div>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 text-right transition-colors focus:border-primary">
                        <SelectValue placeholder="اختر الكلية" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem
                          key={faculty.value}
                          value={faculty.value}
                          className="text-right"
                        >
                          {faculty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {mode === "edit" ? "حفظ التغييرات" : "إنشاء مرشح"}
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

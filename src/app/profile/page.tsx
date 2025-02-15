"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Mail,
  User,
  Building,
  GraduationCap,
  AlertCircle,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userStorage } from "@/lib/storage";
import { ClientOnly } from "@/components/client-only";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Profile form schema
import { z } from "zod";
import {
  updateUser,
  getUserCandidates,
  deleteCandidate,
  deleteUserAccount,
} from "@/app/actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  first_name: z
    .string()
    .min(1, "الاسم الأول مطلوب")
    .min(2, "يجب أن يتكون الاسم الأول من حرفين على الأقل"),
  last_name: z
    .string()
    .min(1, "اسم العائلة مطلوب")
    .min(2, "يجب أن يتكون اسم العائلة من حرفين على الأقل"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userCandidates, setUserCandidates] = useState<any[]>([]);
  const [candidateToDelete, setCandidateToDelete] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = userStorage.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setUserData(user);
        form.reset({
          first_name: user.first_name,
          last_name: user.last_name,
        });

        // Fetch user candidates
        const result = await getUserCandidates(user.id);
        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.candidates) {
          setUserCandidates(result.candidates);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("حدث خطأ أثناء جلب البيانات");
      }
    };

    fetchUserData();
  }, [router, form]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsLoading(true);

      if (!userData?.id) {
        toast.error("يجب تسجيل الدخول لتحديث البيانات");
        return;
      }

      const result = await updateUser(userData.id, values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (!result.user) {
        toast.error("حدث خطأ أثناء تحديث البيانات");
        return;
      }

      // Update local storage with complete user data
      userStorage.setUser({
        ...userData,
        ...result.user,
      });

      // Update state
      setUserData((prev: any) => ({
        ...prev,
        ...result.user,
      }));

      toast.success("تم تحديث البيانات بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteAccount = async () => {
    if (!userData?.id) {
      toast.error("يجب تسجيل الدخول لحذف الحساب");
      return;
    }

    try {
      const result = await deleteUserAccount(userData.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Clear local storage
      userStorage.clearUser();

      // Redirect to home page
      router.push("/");

      toast.success("تم حذف الحساب بنجاح");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("حدث خطأ أثناء حذف الحساب");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCandidate = async () => {
    try {
      const result = await deleteCandidate(candidateToDelete.id, userData.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Remove candidate from state
      setUserCandidates((prev) =>
        prev.filter((c) => c.id !== candidateToDelete.id)
      );

      toast.success("تم حذف المرشح بنجاح");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("حدث خطأ أثناء حذف المرشح");
    } finally {
      setCandidateToDelete(null);
    }
  };

  if (!userData) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                جاري تحميل البيانات...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="max-w-5xl mx-auto p-0 md:p-6">
        <div className="space-y-8">
          {/* Profile Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative h-20 w-20 md:h-24 md:w-24">
                  <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                    <span className="text-2xl font-semibold text-primary">
                      {userData.first_name[0]}
                      {userData.last_name[0]}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">
                      {userData.first_name} {userData.last_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">
                        انضم في{" "}
                        {new Date(userData.created_at).toLocaleDateString(
                          "ar-MA",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    تحديث المعلومات الشخصية
                  </h3>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الاسم الأول</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="أدخل اسمك الأول"
                                    className="pl-3 pr-9"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اسم العائلة</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="أدخل اسم العائلة"
                                    className="pl-3 pr-9"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Read-only email field */}
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <div className="relative">
                          <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            value={userData.email}
                            className="pl-3 pr-9 bg-muted"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          لا يمكن تغيير البريد الإلكتروني
                        </p>
                      </FormItem>

                      <div className="flex items-center justify-end gap-4">
                        <Button
                          type="submit"
                          disabled={isLoading || !form.formState.isDirty}
                        >
                          {isLoading && (
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          )}
                          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <h3 className="text-sm font-medium">منطقة الخطر</h3>
                  </div>
                  <div className="rounded-lg border border-destructive/20 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">حذف الحساب</p>
                        <p className="text-sm text-muted-foreground">
                          سيؤدي حذف حسابك إلى حذف جميع بياناتك بشكل نهائي
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="shrink-0"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        حذف الحساب
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Card */}
          {userCandidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>طلبات العضوية</CardTitle>
                <CardDescription>
                  قائمة الطلبات التي قمت بتسجيلها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {userCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      {candidate.image_url ? (
                        <Image
                          src={candidate.image_url}
                          alt={candidate.full_name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/default_avatar.jpeg"
                          alt="Default Avatar"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {candidate.full_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="w-3 h-3" />
                          {candidate.specialty} - {candidate.faculty}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={() =>
                            router.push(`/candidate/${candidate.id}/edit`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">تعديل</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setCandidateToDelete(candidate)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">حذف</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">عرض</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-[400px] text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              هل أنت متأكد من حذف حسابك؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي إلى حذف حسابك وجميع بياناتك
              بشكل نهائي.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse justify-start sm:justify-start gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف الحساب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Candidate Dialog */}
      <AlertDialog
        open={!!candidateToDelete}
        onOpenChange={(open) => {
          if (!open) setCandidateToDelete(null);
        }}
      >
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader className="gap-2">
            <AlertDialogTitle className="text-xl font-bold text-center">
              هل أنت متأكد من حذف المرشح؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي إلى حذف المرشح وجميع
              بياناته بشكل نهائي.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse justify-start sm:justify-start gap-2">
            <AlertDialogAction
              onClick={handleDeleteCandidate}
              className="bg-destructive hover:bg-destructive/90 flex-1 sm:flex-none"
            >
              حذف المرشح
            </AlertDialogAction>
            <AlertDialogCancel className="flex-1 sm:flex-none">
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Candidate Details Dialog */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={(open) => {
          if (!open) setSelectedCandidate(null);
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
                  <div className="relative h-40 w-40 rounded-full ring-4 ring-primary/10">
                    <Image
                      src="/default_avatar.jpeg"
                      alt="Default Avatar"
                      className="rounded-full object-cover"
                      fill
                      sizes="160px"
                      priority
                    />
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
    </ClientOnly>
  );
}

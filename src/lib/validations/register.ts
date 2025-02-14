import { z } from "zod";

// Regular user registration schema
export const registerSchema = z.object({
  first_name: z
    .string()
    .min(1, "الاسم الأول مطلوب")
    .min(2, "يجب أن يتكون الاسم الأول من حرفين على الأقل"),
  last_name: z
    .string()
    .min(1, "اسم العائلة مطلوب")
    .min(2, "يجب أن يتكون اسم العائلة من حرفين على الأقل"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال عنوان بريد إلكتروني صحيح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

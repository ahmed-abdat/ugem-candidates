import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال عنوان بريد إلكتروني صحيح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

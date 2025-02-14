import { z } from "zod";

export const candidateSchema = z.object({
  full_name: z
    .string()
    .min(1, "الاسم الكامل مطلوب")
    .min(3, "يجب أن يتكون الاسم الكامل من 3 أحرف على الأقل"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[0-9]{8}$/, "يجب أن يتكون رقم الهاتف من 8 أرقام"),
  specialty: z
    .string()
    .min(1, "التخصص مطلوب")
    .min(2, "يجب أن يتكون التخصص من حرفين على الأقل"),
  faculty: z
    .string()
    .min(1, "الكلية مطلوبة")
    .min(2, "يجب أن يتكون اسم الكلية من حرفين على الأقل"),
  address: z
    .string()
    .min(1, "عنوان السكن مطلوب")
    .min(3, "يجب أن يتكون العنوان من 3 أحرف على الأقل"),
  image_url: z.string().optional(),
  creator_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;

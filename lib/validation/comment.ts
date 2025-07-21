import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(2, "Komentar terlalu pendek")
    .max(500, "Komentar terlalu panjang"),
  noteId: z.string(),
});

export type CommentFormValues = z.infer<typeof commentSchema>;

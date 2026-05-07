import { z } from "zod";

const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric segments separated by hyphens.");

const categorySchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(160),
});

const authorSchema = z.object({
  name: z.string().min(1).max(120),
  image: z.string().max(2048).optional(),
  slug: z.string().max(120).optional(),
});

const imageEntrySchema = z.object({
  url: z.string().min(1).max(2048),
  alt: z.string().max(300).optional(),
});

/** 24-char hex MongoDB ObjectId */
const mongoObjectIdString = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Must be a valid post id.");

export const createBlogBodySchema = z.object({
  title: z.string().min(1).max(300),
  slug: slugSchema,
  content: z.string().min(1).max(512_000),
  status: z.enum(["draft", "published"]),
  excerpt: z.string().max(600).optional(),
  featuredImage: z.string().max(2048).optional(),
  images: z.array(imageEntrySchema).max(100).optional(),
  tags: z.array(z.string().max(80)).max(40).optional(),
  category: categorySchema.optional(),
  metaTitle: z.string().max(320).optional(),
  metaDescription: z.string().max(640).optional(),
  canonicalUrl: z.string().max(2048).optional(),
  noindex: z.boolean().optional(),
  author: authorSchema.optional(),
  publishedAt: z.union([z.coerce.date(), z.null()]).optional(),
  templateKey: z.string().max(120).optional(),
  industrySlug: z
    .string()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug (letters, numbers, hyphens).")
    .optional(),
  relatedPostIds: z.array(mongoObjectIdString).max(8).optional(),
});

export const updateBlogBodySchema = createBlogBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update.",
  });

export const listAdminBlogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(10),
  status: z.enum(["draft", "published"]).optional(),
});

export type CreateBlogBody = z.infer<typeof createBlogBodySchema>;
export type UpdateBlogBody = z.infer<typeof updateBlogBodySchema>;

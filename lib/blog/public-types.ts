import type { Types } from "mongoose";

/**
 * UI-safe blog shape: `InferSchemaType` from Mongoose is too loose for nested fields in TS.
 */
export type BlogPublicDoc = {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  content: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean | null;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  category?: { slug: string; name: string } | null;
  author?: { name: string; image?: string; slug?: string } | null;
  tags?: string[] | null;
  /** Admin-curated related doc ids; may be empty. */
  relatedPostIds?: Types.ObjectId[] | null;
  /** Optional programmatic / industry metadata. */
  templateKey?: string | null;
  industrySlug?: string | null;
};

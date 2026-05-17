import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const authorSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    image: { type: String, maxlength: 2048 },
    slug: { type: String, maxlength: 120 },
  },
  { _id: false }
);

const imageEntrySchema = new Schema(
  {
    url: { type: String, required: true, maxlength: 2048 },
    alt: { type: String, maxlength: 300 },
  },
  { _id: false }
);

const categorySchema = new Schema(
  {
    slug: { type: String, required: true, maxlength: 120 },
    name: { type: String, required: true, maxlength: 160 },
  },
  { _id: false }
);

const faqEntrySchema = new Schema(
  {
    question: { type: String, required: true, maxlength: 300 },
    answer: { type: String, required: true, maxlength: 2000 },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 300 },
    slug: {
      type: String,
      required: true,
      maxlength: 200,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => slugRegex.test(v),
        message: "Slug must be lowercase alphanumeric segments separated by hyphens.",
      },
    },
    content: { type: String, required: true, maxlength: 512_000 },
    excerpt: { type: String, maxlength: 600 },
    featuredImage: { type: String, maxlength: 2048 },
    images: { type: [imageEntrySchema], default: [] },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length <= 40,
        message: "At most 40 tags allowed.",
      },
    },
    category: categorySchema,
    metaTitle: { type: String, maxlength: 320 },
    metaDescription: { type: String, maxlength: 640 },
    canonicalUrl: { type: String, maxlength: 2048 },
    noindex: { type: Boolean, default: false },
    author: authorSchema,
    status: {
      type: String,
      enum: ["draft", "published"],
      required: true,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, default: null },
    /** Optional programmatic / industry SEO hooks. */
    templateKey: { type: String, maxlength: 120 },
    industrySlug: { type: String, maxlength: 120, index: true, sparse: true },
    /** Curated related posts (admin). Max 8; non-published ids are ignored at read time. */
    relatedPostIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
      default: [],
      validate: {
        validator: (arr: unknown[]) => arr.length <= 8,
        message: "At most 8 related post ids.",
      },
    },
    faqs: {
      type: [faqEntrySchema],
      default: [],
      validate: {
        validator: (arr: unknown[]) => arr.length <= 20,
        message: "At most 20 FAQs allowed.",
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        const out = ret as Record<string, unknown> & {
          _id?: { toString(): string };
        };
        if (out._id != null) {
          out.id = out._id.toString();
        }
        Reflect.deleteProperty(out, "_id");
      },
    },
    toObject: { virtuals: true },
  }
);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ "category.slug": 1, publishedAt: -1 });
blogSchema.index({ tags: 1, publishedAt: -1 });
blogSchema.index({ templateKey: 1, publishedAt: -1 }, { sparse: true });

export type BlogDocument = InferSchemaType<typeof blogSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type BlogModel = Model<BlogDocument>;

function ensurePublishedDates(this: BlogDocument) {
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.status === "draft") {
    this.publishedAt = null;
  }
}

blogSchema.pre("save", ensurePublishedDates);

const existingBlogModel = mongoose.models.Blog as BlogModel | undefined;
if (existingBlogModel && !existingBlogModel.schema.path("faqs")) {
  mongoose.deleteModel("Blog");
}

export const Blog: BlogModel =
  (mongoose.models.Blog as BlogModel | undefined) ??
  mongoose.model<BlogDocument>("Blog", blogSchema);

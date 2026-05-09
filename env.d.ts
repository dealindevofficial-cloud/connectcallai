declare namespace NodeJS {
  interface ProcessEnv {
    /** MongoDB connection string for blog and app data */
    MONGODB_URI?: string;
    /** Secret for signing admin session JWT (required for /ccai-admin and /api/admin/*). */
    ADMIN_SESSION_SECRET?: string;
    /** Plain admin password (prefer ADMIN_PASSWORD_HASH in production). */
    ADMIN_PASSWORD?: string;
    /** Bcrypt hash of admin password (preferred over ADMIN_PASSWORD). */
    ADMIN_PASSWORD_HASH?: string;
    /** Site origin for canonical URLs and OG (no trailing slash). */
    NEXT_PUBLIC_SITE_URL?: string;
    /** Public Calendly booking page URL used for embed and booking links. */
    NEXT_PUBLIC_CALENDLY_URL?: string;
    /**
     * Comma-separated hostnames allowed for `next/image` (markdown/CDN). Example: `res.cloudinary.com,images.example.com`
     */
    NEXT_PUBLIC_IMAGE_REMOTE_HOSTS?: string;
    /** Max failed login attempts per IP per window before HTTP 429 (default 10). */
    ADMIN_LOGIN_MAX_ATTEMPTS_PER_WINDOW?: string;
    /** Rolling window for login rate limit in ms (default 900000 = 15 minutes). */
    ADMIN_LOGIN_RATE_WINDOW_MS?: string;
    /** Optional shared secret: when set, `/api/vapi/webhook` requires Bearer or `X-Vapi-Secret`. */
    VAPI_WEBHOOK_SECRET?: string;
    /** Cloudinary cloud name (server-only; used by `/api/admin/upload`). */
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    /** Optional folder prefix for uploads (default `connectcallai-blog`). */
    CLOUDINARY_UPLOAD_FOLDER?: string;
  }
}

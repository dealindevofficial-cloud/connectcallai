import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifySessionJwt } from "@/lib/auth/session";

export default async function AdminIndexPage() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthed = token ? await verifySessionJwt(token) : false;

  if (isAuthed) {
    redirect("/ccai-admin/blog");
  }

  redirect("/ccai-admin/login?from=%2Fccai-admin%2Fblog");
}

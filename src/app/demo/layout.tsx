import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const host = headers().get("host")?.toLowerCase().replace(/:\d+$/, "") ?? "";
  if (host === "crsetsolutions.com" || host === "www.crsetsolutions.com") {
    redirect("/");
  }
  return <>{children}</>;
}

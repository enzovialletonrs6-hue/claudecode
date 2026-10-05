import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Ton espace",
  robots: { index: false },
};

// Toute la zone /app est réservée aux personnes connectées.
export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const { user } = await getCurrentUser();
  if (!user) redirect("/connexion");

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
        {children}
      </main>
    </>
  );
}

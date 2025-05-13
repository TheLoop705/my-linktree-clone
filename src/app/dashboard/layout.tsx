"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    // You can render a loading spinner here or null
    return <p>Loading session or redirecting...</p>;
  }

  // If session exists, render the children (the dashboard page)
  return (
    <div className="min-h-screen flex flex-col">
      {/* You can add a shared dashboard navbar or sidebar here */}
      {/* <header className="bg-gray-800 text-white p-4">
        Dashboard Navigation
      </header> */}
      <main className="flex-grow p-4 md:p-8">{children}</main>
    </div>
  );
}

"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div>
      <SignedIn>
        <h1>Dashboard - You are signed in ✅</h1>
      </SignedIn>

      <SignedOut>
        <h1>Please sign in to view the dashboard</h1>
        <SignInButton />
      </SignedOut>
    </div>
  );
}

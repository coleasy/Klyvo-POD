import { Suspense } from "react";
import SignInClient from "./sign-in-client";

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-[100svh] bg-[#11100e]" />}>
      <SignInClient />
    </Suspense>
  );
}

import { Suspense } from "react";
import SignUpClient from "./sign-up-client";

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="min-h-[100svh] bg-[#11100e]" />}>
      <SignUpClient />
    </Suspense>
  );
}

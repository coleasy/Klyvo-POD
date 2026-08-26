'use client';

import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSafeRedirectUrl } from "@/lib/auth-redirect";

export default function SSOCallbackPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) return;

    const postAuthRedirect = sessionStorage.getItem("postAuthRedirect");
    if (postAuthRedirect) {
      sessionStorage.removeItem("postAuthRedirect");
      window.location.href = getSafeRedirectUrl(postAuthRedirect, "/");
      return;
    }

    router.replace("/");
  }, [isSignedIn, router]);

  return (
    <main className="grid min-h-[100svh] place-items-center bg-[#11100e] text-white">
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    </main>
  );
}

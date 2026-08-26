'use client';

import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import AuthPageShell from "@/components/auth/auth-page-shell";
import { getSafeRedirectUrl } from "@/lib/auth-redirect";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v4.15h5.76c-.25 1.34-1.6 3.93-5.76 3.93A6.28 6.28 0 1 1 12 5.72c2.37 0 3.96 1.01 4.87 1.88l3.32-3.2A11.2 11.2 0 0 0 12 1.2a10.8 10.8 0 1 0 0 21.6c6.24 0 10.38-4.38 10.38-10.55 0-.7-.08-1.24-.17-1.77H12Z" />
      <path fill="#4285F4" d="M22.38 12.25c0-.7-.08-1.24-.17-1.77H12v3.87h5.76c-.48 2.53-2.25 3.94-4.23 4.55l3.43 2.66c3.25-1.85 5.42-5.08 5.42-9.31Z" />
      <path fill="#FBBC05" d="M5.75 14.63A6.48 6.48 0 0 1 5.4 12c0-.92.16-1.8.45-2.63L2.34 6.66A10.8 10.8 0 0 0 1.2 12c0 1.92.5 3.72 1.38 5.28l3.17-2.65Z" />
      <path fill="#34A853" d="M12 22.8c2.92 0 5.37-.96 7.16-2.61l-3.43-2.66c-.95.64-2.17 1.08-3.73 1.08-2.79 0-5.16-1.89-6-4.43l-3.47 2.67A10.8 10.8 0 0 0 12 22.8Z" />
    </svg>
  );
}

function clerkMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "errors" in error) {
    const errors = (error as { errors?: Array<{ longMessage?: string; message?: string }> }).errors;
    const message = errors?.[0]?.longMessage || errors?.[0]?.message;
    if (message) return message;
  }
  return fallback;
}

const inputClass = "min-h-[52px] w-full rounded-xl border border-white/12 bg-white/[.045] px-4 text-sm text-white outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-[#c7a16a] focus:bg-[#c7a16a]/[.055] focus:ring-2 focus:ring-[#c7a16a]/10";
const labelClass = "text-[10px] font-black uppercase tracking-[.16em] text-white/50";

export default function SignInClient() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirectUrl(searchParams.get("redirect_url"), "/");
  const isForgotPassword = searchParams.get("mode") === "forgot-password";
  const signUpHref = `/sign-up?redirect_url=${encodeURIComponent(redirectTarget)}`;
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStep, setResetStep] = useState<"request" | "verify">("request");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({ identifier: email.trim(), password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectTarget);
        router.refresh();
      }
    } catch (caught) {
      setError(clerkMessage(caught, "Sign-in failed. Check your details and try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!isLoaded) return;
    sessionStorage.setItem("postAuthRedirect", redirectTarget);
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: redirectTarget,
    });
  }

  async function handleSendResetCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !resetEmail.trim()) return;
    setResetLoading(true);
    setResetError("");
    setResetMessage("");

    try {
      await signIn.create({ strategy: "reset_password_email_code", identifier: resetEmail.trim() });
      setResetStep("verify");
      setResetMessage("A verification code was sent to your email.");
    } catch (caught) {
      setResetError(clerkMessage(caught, "We couldn’t send a reset code. Check your email and try again."));
    } finally {
      setResetLoading(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !resetCode.trim() || !newPassword) return;
    setResetLoading(true);
    setResetError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode.trim(),
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectTarget);
        router.refresh();
      }
    } catch (caught) {
      setResetError(clerkMessage(caught, "We couldn’t reset your password. Check the code and try again."));
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <AuthPageShell>
      {isForgotPassword ? (
        <div className="flex flex-col gap-5">
          <header>
            <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#c7a16a]">Account recovery</p>
            <h1 className="k-display mt-2 text-5xl leading-none text-white sm:text-6xl">Reset password</h1>
            {resetStep === "request" && <p className="mt-3 text-sm leading-6 text-white/45">Enter your email and we’ll send you a verification code.</p>}
          </header>

          {resetStep === "request" ? (
            <form onSubmit={handleSendResetCode} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="reset-email" className={labelClass}>Email</label>
                <input id="reset-email" type="email" autoComplete="email" required value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
              {resetError && <p className="rounded-xl border border-red-400/20 bg-red-400/[.07] px-3 py-2 text-xs leading-5 text-red-300">{resetError}</p>}
              <button type="submit" disabled={resetLoading || !isLoaded || !resetEmail.trim()} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c7a16a] px-5 text-sm font-black uppercase tracking-[.08em] text-black transition hover:bg-[#dfbd8b] disabled:cursor-not-allowed disabled:opacity-45">
                {resetLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending code</> : "Send verification code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              {resetMessage && <p className="rounded-xl border border-[#c7a16a]/25 bg-[#c7a16a]/10 px-3 py-2 text-xs leading-5 text-[#dfbd8b]">{resetMessage}</p>}
              <div className="flex flex-col gap-2">
                <label htmlFor="reset-code" className={labelClass}>Verification code</label>
                <input id="reset-code" inputMode="numeric" autoComplete="one-time-code" value={resetCode} onChange={(event) => setResetCode(event.target.value)} placeholder="Enter the 6-digit code" className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="new-password" className={labelClass}>New password</label>
                <input id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="At least 8 characters" className={inputClass} />
              </div>
              {resetError && <p className="rounded-xl border border-red-400/20 bg-red-400/[.07] px-3 py-2 text-xs leading-5 text-red-300">{resetError}</p>}
              <button type="submit" disabled={resetLoading || !isLoaded} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c7a16a] px-5 text-sm font-black uppercase tracking-[.08em] text-black transition hover:bg-[#dfbd8b] disabled:opacity-45">
                {resetLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating</> : "Set new password"}
              </button>
            </form>
          )}

          <Link href={signInHref} className="flex items-center gap-2 text-xs font-bold text-white/55 transition hover:text-white"><ArrowLeft size={14} /> Back to sign in</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <header>
            <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#c7a16a]">Welcome back</p>
            <h1 className="k-display mt-2 text-5xl leading-none text-white sm:text-6xl">Sign in</h1>
          </header>

          <button type="button" onClick={handleGoogle} disabled={!isLoaded} className="flex min-h-[52px] items-center justify-center gap-3 rounded-xl border border-white/12 bg-white/[.045] px-4 text-sm font-semibold text-white/75 transition hover:border-[#c7a16a]/55 hover:bg-[#c7a16a]/10 hover:text-white disabled:opacity-45">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.12em] text-white/25">
            <span className="h-px flex-1 bg-white/10" /> or continue with email <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="sign-in-email" className={labelClass}>Email</label>
              <input id="sign-in-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="sign-in-password" className={labelClass}>Password</label>
                <Link href={`/sign-in?mode=forgot-password&redirect_url=${encodeURIComponent(redirectTarget)}`} className="text-[11px] font-bold text-[#c7a16a] hover:text-[#dfbd8b]">Forgot password?</Link>
              </div>
              <input id="sign-in-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className={inputClass} />
            </div>
            {error && <p className="rounded-xl border border-red-400/20 bg-red-400/[.07] px-3 py-2 text-xs leading-5 text-red-300">{error}</p>}
            <button type="submit" disabled={loading || !isLoaded} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c7a16a] px-5 text-sm font-black uppercase tracking-[.08em] text-black transition hover:bg-[#dfbd8b] active:scale-[.995] disabled:cursor-not-allowed disabled:opacity-45">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in</> : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-white/40">Don’t have an account? <Link href={signUpHref} className="font-bold text-[#c7a16a] hover:text-[#dfbd8b]">Create one</Link></p>
        </div>
      )}
    </AuthPageShell>
  );
}

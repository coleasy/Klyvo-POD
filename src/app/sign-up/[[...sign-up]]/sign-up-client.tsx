'use client';

import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
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

export default function SignUpClient() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirectUrl(searchParams.get("redirect_url"), "/");
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(redirectTarget)}`;

  const [step, setStep] = useState<"form" | "verify">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordScore = useMemo(
    () => [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((rule) => rule.test(password)).length,
    [password],
  );
  const strength = ["Weak", "Fair", "Good", "Strong"][Math.max(0, passwordScore - 1)];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    setError("");

    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (!parts[0]) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        firstName: parts[0],
        lastName: parts.slice(1).join(" ") || undefined,
        emailAddress: email.trim(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (caught) {
      setError(clerkMessage(caught, "Sign-up failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectTarget);
        router.refresh();
      }
    } catch (caught) {
      setError(clerkMessage(caught, "Invalid verification code. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (caught) {
      setError(clerkMessage(caught, "We couldn’t resend the code. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!isLoaded) return;
    sessionStorage.setItem("postAuthRedirect", redirectTarget);
    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: redirectTarget,
    });
  }

  return (
    <AuthPageShell>
      {step === "verify" ? (
        <div className="flex flex-col gap-5">
          <header>
            <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#c7a16a]">One last step</p>
            <h1 className="k-display mt-2 text-5xl leading-none text-white sm:text-6xl">Check your email</h1>
            <p className="mt-3 text-sm leading-6 text-white/45">We sent a 6-digit verification code to <span className="font-semibold text-white/75">{email}</span>.</p>
          </header>

          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="verification-code" className={labelClass}>Verification code</label>
              <input
                id="verification-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className={`${inputClass} text-center text-lg font-black tracking-[.38em]`}
              />
            </div>
            {error && <p className="rounded-xl border border-red-400/20 bg-red-400/[.07] px-3 py-2 text-xs leading-5 text-red-300">{error}</p>}
            <button type="submit" disabled={loading || !isLoaded || code.length < 6} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c7a16a] px-5 text-sm font-black uppercase tracking-[.08em] text-black transition hover:bg-[#dfbd8b] disabled:cursor-not-allowed disabled:opacity-45">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying</> : "Verify and continue"}
            </button>
          </form>

          <button type="button" onClick={handleResend} disabled={loading || !isLoaded} className="text-center text-xs font-bold text-[#c7a16a] transition hover:text-[#dfbd8b] disabled:opacity-45">Resend code</button>
          <button type="button" onClick={() => { setStep("form"); setCode(""); setError(""); }} className="text-center text-xs text-white/35 transition hover:text-white/65">Use a different email</button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <header>
            <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#c7a16a]">Get started</p>
            <h1 className="k-display mt-2 text-5xl leading-none text-white sm:text-6xl">Create account</h1>
          </header>

          <button type="button" onClick={handleGoogle} disabled={!isLoaded} className="flex min-h-[52px] items-center justify-center gap-3 rounded-xl border border-white/12 bg-white/[.045] px-4 text-sm font-semibold text-white/75 transition hover:border-[#c7a16a]/55 hover:bg-[#c7a16a]/10 hover:text-white disabled:opacity-45">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.12em] text-white/25">
            <span className="h-px flex-1 bg-white/10" /> or sign up with email <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="full-name" className={labelClass}>Full name</label>
              <input id="full-name" type="text" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Alex Morgan" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sign-up-email" className={labelClass}>Email address</label>
              <input id="sign-up-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sign-up-password" className={labelClass}>Password</label>
              <input id="sign-up-password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className={inputClass} />
              {password && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="grid flex-1 grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((item) => <span key={item} className={`h-1 rounded-full ${passwordScore >= item ? "bg-[#c7a16a]" : "bg-white/10"}`} />)}
                  </div>
                  <span className="min-w-10 text-right text-[10px] font-bold uppercase tracking-[.08em] text-white/40">{strength}</span>
                </div>
              )}
            </div>

            {error && <p className="rounded-xl border border-red-400/20 bg-red-400/[.07] px-3 py-2 text-xs leading-5 text-red-300">{error}</p>}

            <button type="submit" disabled={loading || !isLoaded} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c7a16a] px-5 text-sm font-black uppercase tracking-[.08em] text-black transition hover:bg-[#dfbd8b] active:scale-[.995] disabled:cursor-not-allowed disabled:opacity-45">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account</> : "Create account"}
            </button>
          </form>

          <p className="text-center text-[11px] leading-5 text-white/30">By signing up you agree to our <Link href="/terms" className="text-white/55 hover:text-white">Terms</Link> and <Link href="/privacy" className="text-white/55 hover:text-white">Privacy Policy</Link>.</p>
          <p className="text-center text-xs text-white/40">Already have an account? <Link href={signInHref} className="font-bold text-[#c7a16a] hover:text-[#dfbd8b]">Sign in</Link></p>
        </div>
      )}
    </AuthPageShell>
  );
}

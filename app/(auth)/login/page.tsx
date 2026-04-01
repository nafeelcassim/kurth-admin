"use client";

import { useAuth } from "@/hooks";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import Turnstile from "react-turnstile";

const TurnstileWidget = memo(function TurnstileWidget(props: {
  sitekey: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}) {
  return (
    <Turnstile
      sitekey={props.sitekey}
      onVerify={props.onVerify}
      onExpire={props.onExpire}
      onError={props.onError}
      theme="light"
    />
  );
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_SITE_KEY;

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  const canRenderTurnstile = useMemo(
    () => Boolean(turnstileSiteKey && turnstileSiteKey.trim().length > 0),
    [turnstileSiteKey],
  );

  const {login: {isPending, error, mutateAsync}} = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setError(null);

    if (!captchaToken) return;

    await mutateAsync({
      email: email.toLowerCase().trim(),
      password,
      captchaToken,
    });

    // const sampleUsername = "admin@kurthglass.com";
    // const samplePassword = "kurth123";

    // if (email.trim().toLowerCase() === sampleUsername && password === samplePassword) {
    //   document.cookie = "kurth_auth=1; Path=/; Max-Age=604800; SameSite=Lax";
    //   router.push("/");
    //   return;
    // }

    // setError("Invalid username or password.");
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-950">
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-row items-center  justify-center gap-10">
              <Image
                src="/logo.png"
                alt="Kurth Glass"
                width={90}
                height={90}
                priority
              />
              <Image
                src="/wording.png"
                alt="Kurth Glass"
                width={100}
                height={40}
                className="mt-3"
              />
            </div>

            <div className="mt-8 flex flex-col gap-1">
              <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
              <p className="text-sm text-zinc-600">
                Use your company email and password.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error.message ?? 'Something went wrong'}
                </div>
              ) : null}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-800"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@kurthglass.com"
                  className="h-11 w-full rounded-xl border border-zinc-200/80 bg-white/70 px-3 text-sm text-zinc-950 shadow-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/15"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-800"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-sky-700 underline-offset-4 hover:underline"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-zinc-200/80 bg-white/70 px-3 text-sm text-zinc-950 shadow-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/15"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                {canRenderTurnstile ? (
                  <TurnstileWidget
                    sitekey={turnstileSiteKey as string}
                    onVerify={handleCaptchaVerify}
                    onExpire={handleCaptchaExpire}
                    onError={handleCaptchaError}
                  />
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    Missing `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15"
              >
                Sign in
              </button>

              <div className="pt-2 text-center text-xs text-zinc-500">
                By continuing, you agree to the company policies.
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} Kurth Glass
          </div>
        </div>
      </div>
    </div>
  );
}

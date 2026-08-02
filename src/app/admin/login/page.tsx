// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// export default function AdminLoginPage() {
//   const router = useRouter()
//   const [error, setError] = useState('')

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     setError('')

//     const form = e.currentTarget
//     const email = (form.elements.namedItem('email') as HTMLInputElement).value
//     const password = (form.elements.namedItem('password') as HTMLInputElement).value

//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })

//     if (res.ok) {
//       router.push('/admin')
//     } else {
//       setError('Invalid email or password')
//     }
//   }

//   return (
//     <main style={{ padding: '2rem' }}>
//       <h1>Admin Login</h1>
//       <form onSubmit={handleSubmit}>
//         <input name="email" type="email" placeholder="Email" required /><br />
//         <input name="password" type="password" placeholder="Password" required /><br />
//         <button type="submit">Log In</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </main>
//   )
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Invalid email or password.",
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5ff] px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#7779ff]/15 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 right-0 h-[460px] w-[460px] rounded-full bg-[#a8ff60]/15 blur-[130px]"
      />

      <div className="relative grid w-full max-w-[1050px] overflow-hidden rounded-[32px] border border-[#dedbea] bg-white shadow-[0_30px_100px_rgba(45,39,85,0.14)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden min-h-[650px] overflow-hidden bg-[#4648d4] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-white/[0.06]"
          />

          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-white/70">
              Secure Admin Access
            </p>

            <h1 className="mt-5 max-w-md text-5xl font-black leading-[0.98] tracking-[-0.04em]">
              Manage your digital platform from one place.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/70">
              Access leads, services, portfolio projects, SEO pages,
              testimonials, FAQs and website settings.
            </p>
          </div>

          <div className="relative z-10 rounded-[24px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur">
            <p className="text-sm font-semibold">
              SEO Engine Admin
            </p>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Authorized administrators only. All login activity may be
              monitored for security.
            </p>
          </div>
        </section>

        <section className="flex min-h-[620px] items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-[430px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ece8ff] text-[#4648d4] lg:hidden">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-[#4648d4] lg:mt-0">
              Welcome Back
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#1b1b23]">
              Admin Login
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#6b7280]">
              Enter your administrator credentials to continue.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#262631]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9b99aa]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@company.com"
                    className="h-14 w-full rounded-2xl border border-[#d8d5e4] bg-[#fbfaff] pl-12 pr-4 text-[#1b1b23] outline-none transition placeholder:text-[#aaa8b7] focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#262631]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9b99aa]" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-2xl border border-[#d8d5e4] bg-[#fbfaff] pl-12 pr-12 text-[#1b1b23] outline-none transition placeholder:text-[#aaa8b7] focus:border-[#6466e8] focus:bg-white focus:ring-4 focus:ring-[#6466e8]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8998] transition hover:text-[#4648d4]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#4648d4] px-5 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#393bc7] hover:shadow-[0_16px_36px_rgba(70,72,212,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Signing In..." : "Log In"}

                {!loading && (
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-5 text-[#8b8998]">
              This area is restricted to authorized administrators.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
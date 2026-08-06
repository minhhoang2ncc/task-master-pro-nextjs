'use client'

import { useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import type { SignupFormState } from '@repo/types/schemas'
import { User, Mail, Lock, Briefcase, UserPlus, Loader2, Zap } from 'lucide-react'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<SignupFormState, FormData>(signup, undefined)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0A1B] py-10">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse [animation-delay:1.5s]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/30 mb-4">
            <Zap className="size-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-gray-400 mt-2 text-sm">Join TaskMaster Pro and start managing tasks</p>
        </div>

        {/* Glassmorphic card */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {/* Error banner */}
          {state?.message && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <span className="shrink-0 size-2 rounded-full bg-red-400" />
              {state.message}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-displayName" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  ref={nameRef}
                  id="signup-displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Nguyễn Văn A"
                  defaultValue={state?.fields?.displayName ?? ''}
                  aria-describedby="signup-name-error"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all"
                />
              </div>
              {state?.errors?.displayName && (
                <p id="signup-name-error" className="text-red-400 text-xs mt-1">
                  {state.errors.displayName[0]}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  defaultValue={state?.fields?.email ?? ''}
                  aria-describedby="signup-email-error"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all"
                />
              </div>
              {state?.errors?.email && (
                <p id="signup-email-error" className="text-red-400 text-xs mt-1">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label htmlFor="signup-role" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Role / Position
              </label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  id="signup-role"
                  name="role"
                  type="text"
                  autoComplete="organization-title"
                  required
                  placeholder="e.g. Frontend Engineer"
                  defaultValue={state?.fields?.role ?? ''}
                  aria-describedby="signup-role-error"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all"
                />
              </div>
              {state?.errors?.role && (
                <p id="signup-role-error" className="text-red-400 text-xs mt-1">
                  {state.errors.role[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="At least 8 characters"
                  aria-describedby="signup-password-error"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all"
                />
              </div>
              {state?.errors?.password && (
                <p id="signup-password-error" className="text-red-400 text-xs mt-1">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              {isPending ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-transparent text-gray-500">Already have an account?</span>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center w-full py-3 px-6 rounded-xl text-sm font-medium text-gray-300 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all duration-200"
          >
            Sign in instead
          </Link>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} TaskMaster Pro. All rights reserved.
        </p>
      </div>
    </div>
  )
}

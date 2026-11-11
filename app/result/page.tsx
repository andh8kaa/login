"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useSyncExternalStore } from "react";

const emptyData: Record<string, string> = {};
let cachedRaw: string | null = null;
let cachedData: Record<string, string> = emptyData;

function getStoredUser(): Record<string, string> {
  if (typeof window === "undefined") return emptyData;
  try {
    const raw =
      localStorage.getItem("registeredUser") ||
      sessionStorage.getItem("registeredUser");
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedData = raw ? (JSON.parse(raw) as Record<string, string>) : emptyData;
    }
    return cachedData;
  } catch {
    return emptyData;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function ResultContent() {
  const searchParams = useSearchParams();
  const storedData = useSyncExternalStore(
    subscribe,
    getStoredUser,
    () => emptyData
  );

  const name =
    searchParams.get("name") ||
    storedData.name ||
    "-";
  const email =
    searchParams.get("email") ||
    storedData.email ||
    "-";
  const phone =
    searchParams.get("phone") ||
    searchParams.get("nomor_hp") ||
    searchParams.get("nohp") ||
    storedData.phone ||
    "-";
  const password =
    searchParams.get("password") ||
    storedData.password ||
    "-";
  const passwordConfirmation =
    searchParams.get("passwordConfirmation") ||
    searchParams.get("confirmPassword") ||
    searchParams.get("password_confirmation") ||
    storedData.passwordConfirmation ||
    storedData.confirmPassword ||
    "-";

  return (
    <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Data Registrasi</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Rincian data akun yang telah diregistrasi.
        </p>
      </div>

      <div className="space-y-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <div className="pt-3 first:pt-0">
          <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Nama Lengkap
          </span>
          <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </p>
        </div>

        <div className="pt-3">
          <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Email
          </span>
          <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
            {email}
          </p>
        </div>

        <div className="pt-3">
          <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Nomor HP
          </span>
          <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
            {phone}
          </p>
        </div>

        <div className="pt-3">
          <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Password
          </span>
          <p className="mt-1 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
            {password}
          </p>
        </div>

        <div className="pt-3">
          <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Password Confirmation
          </span>
          <p className="mt-1 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
            {passwordConfirmation}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-md bg-zinc-900 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Ke Halaman Login
        </Link>
        <Link
          href="/register"
          className="flex w-full items-center justify-center rounded-md border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Kembali ke Register
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-center text-sm text-zinc-500">
            Memuat data...
          </div>
        }
      >
        <ResultContent />
      </Suspense>
    </div>
  );
}

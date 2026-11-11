"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (!res.success || !res.user) {
        setError(res.error || "Email atau password salah.");
        setLoading(false);
        return;
      }

      const userData = {
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        password: res.user.password,
        passwordConfirmation: res.user.password,
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("registeredUser", JSON.stringify(userData));
      }

      const params = new URLSearchParams(userData);
      router.push(`/result?${params.toString()}`);
    } catch {
      setError("Terjadi kendala saat menghubungkan ke database.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="mb-2 text-center text-2xl font-bold">Masuk ke Akun</h1>
        <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Masukkan email dan password Anda untuk masuk
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Masukkan email terdaftar"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Masukkan password"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-zinc-900 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? "Memeriksa Akun..." : "Login"}
            </button>
            <Link
              href="/register"
              className="flex w-full items-center justify-center rounded-md border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Belum Punya Akun? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

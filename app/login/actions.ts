"use server";

import { prisma } from "@/src/prisma";

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(data: LoginInput) {
  try {
    if (!data.email || !data.password) {
      return { success: false, error: "Email dan password wajib diisi." };
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || user.password !== data.password) {
      return { success: false, error: "Email atau password tidak sesuai." };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
      },
    };
  } catch (error) {
    console.error("Gagal melakukan login:", error);
    return { success: false, error: "Terjadi kesalahan pada sistem." };
  }
}

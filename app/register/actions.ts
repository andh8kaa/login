"use server";

import { prisma } from "@/src/prisma";

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function registerUser(data: RegisterInput) {
  try {
    if (!data.name || !data.email || !data.phone || !data.password) {
      return { success: false, error: "Semua kolom wajib diisi." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Email ini sudah terdaftar." };
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.error("Gagal registrasi user:", error);
    return { success: false, error: "Terjadi kesalahan pada sistem." };
  }
}

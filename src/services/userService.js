import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.js';

const prisma = new PrismaClient();

export class UserService {
  static async authenticateUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Kiritilgan login yoki parol noto'g'ri.", 401);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static async registerUser(name, email, password) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Ushbu login/email bilan allaqachon ro'yxatdan o'tilgan.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user',
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static async updateProfile(userId, name, email) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("Foydalanuvchi topilmadi.", 404);
    }

    if (email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError("Ushbu email manzili allaqachon ro'yxatdan o'tgan.", 409);
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    };
  }

  static async updatePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("Foydalanuvchi topilmadi.", 404);
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError("Hozirgi parol noto'g'ri kiritildi.", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return true;
  }
}

import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError.js';

const prisma = new PrismaClient();

export class CategoryService {
  static async getCategories(userId) {
    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  }

  static async getSystemAndUserCategories(userId) {
    const [systemCategories, userCategories] = await Promise.all([
      prisma.category.findMany({
        where: { userId: null },
        orderBy: { name: 'asc' },
      }),
      prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      }),
    ]);

    return { systemCategories, userCategories };
  }

  static async createCategory(userId, { name, type, color, icon }) {
    if (!name || !type) {
      throw new AppError("Kategoriya nomi va turi kiritilishi shart.", 400);
    }

    return await prisma.category.create({
      data: {
        userId,
        name: name.trim(),
        type: type === 'income' ? 'income' : 'expense',
        color: color || '#10B981',
        icon: icon || 'tag',
      },
    });
  }

  static async updateCategory(userId, id, { name, type, color, icon }) {
    const existing = await prisma.category.findFirst({
      where: { id: parseInt(id, 10), userId },
    });

    if (!existing) {
      throw new AppError("Kategoriya topilmadi yoki ruxsat yo'q (tizim kategoriyalarini o'zgartirib bo'lmaydi).", 404);
    }

    return await prisma.category.update({
      where: { id: existing.id },
      data: {
        name: name ? name.trim() : existing.name,
        type: type ? (type === 'income' ? 'income' : 'expense') : existing.type,
        color: color || existing.color,
        icon: icon || existing.icon,
      },
    });
  }

  static async deleteCategory(userId, id) {
    const catId = parseInt(id, 10);
    const existing = await prisma.category.findFirst({
      where: { id: catId, userId },
    });

    if (!existing) {
      throw new AppError("Kategoriya topilmadi yoki ruxsat yo'q.", 404);
    }

    const txCount = await prisma.transaction.count({ where: { categoryId: catId } });
    if (txCount > 0) {
      throw new AppError("Ushbu kategoriyaga biriktirilgan tranzaksiyalar mavjud. Uni o'chirib bo'lmaydi.", 400);
    }

    await prisma.category.delete({ where: { id: catId } });
    return true;
  }
}

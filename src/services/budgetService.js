import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError.js';
import { FinancialCalculationService } from './financialCalculationService.js';

const prisma = new PrismaClient();

export class BudgetService {
  static async getBudgetOverview(userId, month, year) {
    const budgetStatus = await FinancialCalculationService.getBudgetStatus(userId, month, year);

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
        type: 'expense',
      },
      orderBy: { name: 'asc' },
    });

    return { budgetStatus, categories };
  }

  static async createOrUpdateBudget(userId, { categoryId, category_id, amount, month, year }) {
    const catId = categoryId !== undefined ? (categoryId ? parseInt(categoryId, 10) : null) : (category_id ? parseInt(category_id, 10) : null);
    const amt = parseFloat(amount);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!amt || amt <= 0) {
      throw new AppError("Byudjet summasi 0 dan katta bo'lishi kerak.", 400);
    }

    const existing = await prisma.budget.findFirst({
      where: {
        userId,
        categoryId: catId,
        month: m,
        year: y,
      },
    });

    if (existing) {
      return await prisma.budget.update({
        where: { id: existing.id },
        data: { amount: amt },
        include: { category: true },
      });
    }

    return await prisma.budget.create({
      data: {
        userId,
        categoryId: catId,
        amount: amt,
        month: m,
        year: y,
      },
      include: { category: true },
    });
  }

  static async updateBudget(userId, id, { amount }) {
    const existing = await prisma.budget.findFirst({
      where: { id: parseInt(id, 10), userId },
    });

    if (!existing) {
      throw new AppError("Byudjet topilmadi yoki ruxsat yo'q.", 404);
    }

    return await prisma.budget.update({
      where: { id: existing.id },
      data: { amount: parseFloat(amount) },
      include: { category: true },
    });
  }

  static async deleteBudget(userId, id) {
    const existing = await prisma.budget.findFirst({
      where: { id: parseInt(id, 10), userId },
    });

    if (!existing) {
      throw new AppError("Byudjet topilmadi yoki ruxsat yo'q.", 404);
    }

    await prisma.budget.delete({ where: { id: existing.id } });
    return true;
  }
}

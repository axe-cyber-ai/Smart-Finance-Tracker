import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const apiAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalTransactions, totalBudgets, totalCategories] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.budget.count(),
    prisma.category.count(),
  ]);

  return sendSuccess(res, 200, "Tizim umumiy statistikasi olindi.", {
    totalUsers,
    totalTransactions,
    totalBudgets,
    totalCategories,
  });
});

export const apiAdminUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          transactions: true,
          budgets: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, 200, "Foydalanuvchilar ro'yxati olindi.", users);
});

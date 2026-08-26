import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { FinancialCalculationService } from '../../services/financialCalculationService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const apiGetDashboard = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [netBalance, totalIncome, totalExpense, budgetStatus, latestTransactions] = await Promise.all([
    FinancialCalculationService.getBalance(userId),
    FinancialCalculationService.getTotalIncome(userId, currentMonth, currentYear),
    FinancialCalculationService.getTotalExpense(userId, currentMonth, currentYear),
    FinancialCalculationService.getBudgetStatus(userId, currentMonth, currentYear),
    prisma.transaction.findMany({
      where: { userId },
      take: 5,
      orderBy: { transactionDate: 'desc' },
      include: { category: { select: { id: true, name: true, color: true, icon: true } } },
    }),
  ]);

  return sendSuccess(res, 200, "Dashboard ko'rsatkichlari muvaffaqiyatli olindi.", {
    metrics: {
      totalBalance: netBalance,
      monthlyIncome: totalIncome,
      monthlyExpense: totalExpense,
      budgetedAmount: budgetStatus.overall.budgeted,
      remainingBudget: budgetStatus.overall.remaining,
    },
    latestTransactions,
  });
});

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { FinancialCalculationService } from '../../services/financialCalculationService.js';
import { AiFinanceService } from '../../services/aiFinanceService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const apiGetReportsSummary = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const now = new Date();
  const month = parseInt(req.query.month, 10) || (now.getMonth() + 1);
  const year = parseInt(req.query.year, 10) || now.getFullYear();

  const [income, expense, categoryBreakdown] = await Promise.all([
    FinancialCalculationService.getTotalIncome(userId, month, year),
    FinancialCalculationService.getTotalExpense(userId, month, year),
    FinancialCalculationService.getCategoryBreakdown(userId, month, year),
  ]);

  return sendSuccess(res, 200, "Hisobotlar xulosasi olindi.", {
    period: { month, year },
    summary: {
      income,
      expense,
      savings: income - expense,
    },
    categoryBreakdown,
  });
});

export const apiExportData = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;

  const [user, transactions, categories, budgets] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true } }),
    prisma.transaction.findMany({ where: { userId } }),
    prisma.category.findMany({ where: { userId } }),
    prisma.budget.findMany({ where: { userId } }),
  ]);

  return sendSuccess(res, 200, "Foydalanuvchi ma'lumotlari zaxira nusxasi (backup).", {
    user,
    transactions,
    categories,
    budgets,
    exportedAt: new Date().toISOString(),
  });
});

export const apiGetAiInsights = asyncHandler(async (req, res) => {
  const user = req.session.user;
  const analysis = await AiFinanceService.analyzeFinancialHealth(user);
  return sendSuccess(res, 200, "AI moliyaviy tahlil ma'lumotlari olindi.", analysis);
});

import { PrismaClient } from '@prisma/client';
import { FinancialCalculationService } from '../services/financialCalculationService.js';

const prisma = new PrismaClient();

export const index = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const totalBalance = await FinancialCalculationService.getBalance(userId);
    const monthlyIncome = await FinancialCalculationService.getTotalIncome(userId, month, year);
    const monthlyExpense = await FinancialCalculationService.getTotalExpense(userId, month, year);

    const budgetStatus = await FinancialCalculationService.getBudgetStatus(userId, month, year);
    const remainingBudget = budgetStatus.overall.remaining;

    const categoryBreakdown = await FinancialCalculationService.getCategoryBreakdown(userId, month, year);
    const monthlyOverview = await FinancialCalculationService.getMonthlyOverview(userId, 6);

    const latestTransactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: [
        { transactionDate: 'desc' },
        { id: 'desc' },
      ],
      take: 5,
    });

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
      },
      orderBy: { name: 'asc' },
    });

    res.render('dashboard', {
      title: 'Bosh sahifa - Dashboard',
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      remainingBudget,
      budgetStatus,
      categoryBreakdown,
      monthlyOverview,
      latestTransactions,
      categories,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).send('Server error');
  }
};

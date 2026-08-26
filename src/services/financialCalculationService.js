import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FinancialCalculationService {
  /**
   * Get total income for a user, optionally filtered by month and year.
   */
  static async getTotalIncome(userId, month = null, year = null) {
    const where = { userId, type: 'income' };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.transactionDate = { gte: startDate, lte: endDate };
    }

    const result = await prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
    });

    return result._sum.amount || 0;
  }

  /**
   * Get total expense for a user, optionally filtered by month and year.
   */
  static async getTotalExpense(userId, month = null, year = null) {
    const where = { userId, type: 'expense' };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.transactionDate = { gte: startDate, lte: endDate };
    }

    const result = await prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
    });

    return result._sum.amount || 0;
  }

  /**
   * Get overall net balance for a user.
   */
  static async getBalance(userId) {
    const totalIncome = await this.getTotalIncome(userId);
    const totalExpense = await this.getTotalExpense(userId);
    return totalIncome - totalExpense;
  }

  /**
   * Get expense category breakdown for a month/year.
   */
  static async getCategoryBreakdown(userId, month = null, year = null) {
    const now = new Date();
    month = month || (now.getMonth() + 1);
    year = year || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: 'expense',
        transactionDate: { gte: startDate, lte: endDate },
      },
      include: { category: true },
    });

    const totalExpense = transactions.reduce((acc, t) => acc + t.amount, 0);

    const groupedMap = {};
    for (const t of transactions) {
      const catId = t.categoryId;
      if (!groupedMap[catId]) {
        groupedMap[catId] = {
          category_id: catId,
          category_name: t.category?.name || 'Boshqa',
          color: t.category?.color || '#6B7280',
          icon: t.category?.icon || 'tag',
          amount: 0,
        };
      }
      groupedMap[catId].amount += t.amount;
    }

    const categories = Object.values(groupedMap).map((cat) => {
      cat.percentage = totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 1000) / 10 : 0;
      return cat;
    }).sort((a, b) => b.amount - a.amount);

    return {
      total_expense: totalExpense,
      categories,
    };
  }

  /**
   * Get budget status comparing set budgets against actual expenses.
   */
  static async getBudgetStatus(userId, month, year) {
    const budgets = await prisma.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
    });

    const overallBudget = budgets.find((b) => b.categoryId === null);
    const totalSpent = await this.getTotalExpense(userId, month, year);

    const categoryBudgets = [];
    const categorySpecificBudgets = budgets.filter((b) => b.categoryId !== null);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    for (const budget of categorySpecificBudgets) {
      const category = budget.category;
      
      const spentResult = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: 'expense',
          transactionDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      });

      const spent = spentResult._sum.amount || 0;
      const budgeted = budget.amount;
      const percentage = budgeted > 0 ? Math.round((spent / budgeted) * 1000) / 10 : 0;
      const remaining = budgeted - spent;

      let status = 'normal';
      if (percentage >= 100) status = 'critical';
      else if (percentage >= 80) status = 'warning';

      categoryBudgets.push({
        id: budget.id,
        category_id: budget.categoryId,
        category_name: category ? category.name : "Noma'lum",
        color: category ? category.color : '#6B7280',
        icon: category ? category.icon : 'tag',
        budgeted,
        spent,
        remaining,
        percentage,
        status,
      });
    }

    const overallAmount = overallBudget ? overallBudget.amount : 0;
    const overallPercentage = overallAmount > 0 ? Math.round((totalSpent / overallAmount) * 1000) / 10 : 0;
    const overallRemaining = overallAmount - totalSpent;

    let overallStatus = 'normal';
    if (overallPercentage >= 100) overallStatus = 'critical';
    else if (overallPercentage >= 80) overallStatus = 'warning';

    return {
      month,
      year,
      overall: {
        has_budget: Boolean(overallBudget),
        id: overallBudget?.id,
        budgeted: overallAmount,
        spent: totalSpent,
        remaining: overallRemaining,
        percentage: overallPercentage,
        status: overallStatus,
      },
      categories: categoryBudgets,
    };
  }

  /**
   * Get 6-month historical income vs expense comparison.
   */
  static async getMonthlyOverview(userId, monthsCount = 6) {
    const labels = [];
    const incomeData = [];
    const expenseData = [];

    const now = new Date();
    const monthNames = [
      '', 'Yanvar', 'Fevral', 'Mart', 'Aprel',
      'May', 'Iyun', 'Iyul', 'Avgust',
      'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();

      labels.push(`${monthNames[month]} ${year}`);
      incomeData.push(await this.getTotalIncome(userId, month, year));
      expenseData.push(await this.getTotalExpense(userId, month, year));
    }

    return {
      labels,
      income: incomeData,
      expense: expenseData,
    };
  }
}

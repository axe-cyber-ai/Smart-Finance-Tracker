import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const index = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const startDateStr = req.query.start_date || startOfMonth.toISOString().split('T')[0];
    const endDateStr = req.query.end_date || endOfMonth.toISOString().split('T')[0];

    const startDate = new Date(startDateStr);
    const endDate = new Date(`${endDateStr}T23:59:59`);

    const where = {
      userId,
      transactionDate: { gte: startDate, lte: endDate },
    };

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
    });

    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpense;

    const transactionCount = transactions.length;
    const avgTransaction = transactionCount > 0 ? (totalIncome + totalExpense) / transactionCount : 0;
    
    const expenseAmounts = transactions.filter((t) => t.type === 'expense').map((t) => t.amount);
    const maxExpense = expenseAmounts.length > 0 ? Math.max(...expenseAmounts) : 0;

    // Group expenses by category
    const expenseGroupMap = {};
    for (const t of transactions.filter((t) => t.type === 'expense')) {
      const catId = t.categoryId;
      if (!expenseGroupMap[catId]) {
        expenseGroupMap[catId] = {
          name: t.category?.name || "Noma'lum",
          color: t.category?.color || '#6B7280',
          icon: t.category?.icon || 'tag',
          amount: 0,
          count: 0,
        };
      }
      expenseGroupMap[catId].amount += t.amount;
      expenseGroupMap[catId].count += 1;
    }

    const expenseCategoryBreakdown = Object.values(expenseGroupMap).map((cat) => {
      cat.percentage = totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 1000) / 10 : 0;
      return cat;
    }).sort((a, b) => b.amount - a.amount);

    res.render('reports/index', {
      title: 'Hisobotlar va Tahlil',
      startDate: startDateStr,
      endDate: endDateStr,
      totalIncome,
      totalExpense,
      netSavings,
      transactionCount,
      avgTransaction,
      maxExpense,
      expenseCategoryBreakdown,
    });
  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).send('Server error');
  }
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const showAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTransactions = await prisma.transaction.count();
    const totalCategories = await prisma.category.count();
    const totalBudgets = await prisma.budget.count();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { transactions: true, budgets: true }
        }
      }
    });

    const recentTransactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        category: { select: { name: true, color: true } }
      }
    });

    res.render('admin/dashboard', {
      layout: 'layouts/main',
      title: 'ADMIN // CONTROL PANEL',
      totalUsers,
      totalTransactions,
      totalCategories,
      totalBudgets,
      users,
      recentTransactions,
      user: req.session.user
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).send('Server Error in Admin Panel');
  }
};

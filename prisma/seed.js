import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Node.js database...');

  // Clean up all existing demo user & admin data cleanly
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: ['demo@smartfinance.uz', '1234', 'admin123', 'user123'] } },
  });

  const userIds = existingUsers.map((u) => u.id);
  if (userIds.length > 0) {
    await prisma.transaction.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.budget.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.category.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  }

  // 1. Create Regular User 1: Login '1234', Password '1234', Name 'Ali'
  const hashedUserPass = await bcrypt.hash('1234', 10);
  const user = await prisma.user.create({
    data: {
      email: '1234',
      name: 'Ali',
      password: hashedUserPass,
      role: 'user',
    },
  });

  // 2. Create Regular User 2: Login 'user123', Password 'user123', Name 'Vali'
  const hashedUser2Pass = await bcrypt.hash('user123', 10);
  const user2 = await prisma.user.create({
    data: {
      email: 'user123',
      name: 'Vali',
      password: hashedUser2Pass,
      role: 'user',
    },
  });

  // 3. Create Admin User: Login 'admin123', Password 'admin123', Name 'Administrator'
  const hashedAdminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin123',
      name: 'Administrator',
      password: hashedAdminPass,
      role: 'admin',
    },
  });

  console.log('User 1 created:', user.name, 'Login: 1234');
  console.log('User 2 created:', user2.name, 'Login: user123');
  console.log('Admin created:', admin.name, 'Login: admin123');

  // 4. Default System Categories (userId: null)
  const systemCategories = [
    // Income
    { name: 'Oylik Maosh', type: 'income', icon: 'banknotes', color: '#10B981' },
    { name: 'Frilans', type: 'income', icon: 'computer-desktop', color: '#3B82F6' },
    { name: 'Biznes', type: 'income', icon: 'briefcase', color: '#8B5CF6' },
    { name: 'Investitsiya', type: 'income', icon: 'chart-bar', color: '#F59E0B' },
    { name: "Sovg'a", type: 'income', icon: 'gift', color: '#EC4899' },
    { name: 'Boshqa Daromad', type: 'income', icon: 'ellipsis-horizontal-circle', color: '#6B7280' },

    // Expense
    { name: 'Oziq-ovqat', type: 'expense', icon: 'shopping-cart', color: '#EF4444' },
    { name: 'Transport', type: 'expense', icon: 'truck', color: '#F97316' },
    { name: 'Xaridlar', type: 'expense', icon: 'shopping-bag', color: '#EC4899' },
    { name: "Ta'lim", type: 'expense', icon: 'academic-cap', color: '#6366F1' },
    { name: 'Salomatlik', type: 'expense', icon: 'heart', color: '#14B8A6' },
    { name: "Hordiq/Ko'ngilochar", type: 'expense', icon: 'sparkles', color: '#8B5CF6' },
    { name: "Kommunal To'lovlar", type: 'expense', icon: 'home', color: '#06B6D4' },
    { name: 'Boshqa Xarajat', type: 'expense', icon: 'credit-card', color: '#9CA3AF' },
  ];

  const categoryMap = {};

  for (const catData of systemCategories) {
    const existing = await prisma.category.findFirst({
      where: { userId: null, name: catData.name, type: catData.type },
    });

    if (existing) {
      categoryMap[catData.name] = existing;
    } else {
      const created = await prisma.category.create({
        data: {
          name: catData.name,
          type: catData.type,
          icon: catData.icon,
          color: catData.color,
          userId: null,
        },
      });
      categoryMap[catData.name] = created;
    }
  }

  // Seed Transactions for Ali
  const now = new Date();

  for (let m = 2; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    // Monthly Salary
    await prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId: categoryMap['Oylik Maosh'].id,
        type: 'income',
        amount: 12500000.0,
        description: `Asosiy oylik maosh - ${month}/${year}`,
        transactionDate: new Date(year, month - 1, 1),
      },
    });

    // Expenses for Ali
    const monthlyExpenses = [
      { cat: "Kommunal To'lovlar", day: 3, amount: 650000, desc: "Elektr, gaz va suv to'lovi" },
      { cat: 'Oziq-ovqat', day: 4, amount: 850000, desc: 'Korzinka supermarket xaridlari' },
      { cat: 'Transport', day: 6, amount: 180000, desc: 'Yandex Taxi va benzin' },
      { cat: 'Oziq-ovqat', day: 11, amount: 920000, desc: 'Haftalik oziq-ovqat xaridi' },
    ];

    for (const exp of monthlyExpenses) {
      const txDate = new Date(year, month - 1, exp.day);
      if (txDate > now) continue;

      await prisma.transaction.create({
        data: {
          userId: user.id,
          categoryId: categoryMap[exp.cat].id,
          type: 'expense',
          amount: exp.amount,
          description: exp.desc,
          transactionDate: txDate,
        },
      });
    }
  }

  // Seed Transactions for Vali (User 2)
  await prisma.transaction.create({
    data: {
      userId: user2.id,
      categoryId: categoryMap['Oylik Maosh'].id,
      type: 'income',
      amount: 9800000.0,
      description: 'Loyiha maoshi',
      transactionDate: new Date(now.getFullYear(), now.getMonth(), 2),
    },
  });

  await prisma.transaction.create({
    data: {
      userId: user2.id,
      categoryId: categoryMap['Oziq-ovqat'].id,
      type: 'expense',
      amount: 450000.0,
      description: 'Makro supermarket',
      transactionDate: new Date(now.getFullYear(), now.getMonth(), 5),
    },
  });

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

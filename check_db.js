import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://49DeQGZjvZUmig7.root:nC54EBcSzRaGWd3F@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/smart_finance_db?sslaccept=strict'
    }
  }
});

async function main() {
  console.log('\n========== DATABASE MA\'LUMOTLARI ==========\n');

  // Foydalanuvchilar
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  console.log(`👥 FOYDALANUVCHILAR (${users.length} ta):`);
  users.forEach(u => console.log(`  [${u.id}] ${u.name} | ${u.email} | rol: ${u.role} | ${u.createdAt}`));

  // Kategoriyalar
  const categories = await prisma.category.findMany();
  console.log(`\n🏷️  KATEGORIYALAR (${categories.length} ta):`);
  categories.forEach(c => console.log(`  [${c.id}] ${c.name} | ${c.type} | userId: ${c.userId}`));

  // Tranzaksiyalar
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  console.log(`\n💸 TRANZAKSIYALAR (${transactions.length} ta, oxirgi 20):`);
  transactions.forEach(t => console.log(`  [${t.id}] ${t.type} | ${t.amount} | userId: ${t.userId} | ${t.description || '-'} | ${t.transactionDate}`));

  // Byudjetlar
  const budgets = await prisma.budget.findMany();
  console.log(`\n📊 BYUDJETLAR (${budgets.length} ta):`);
  budgets.forEach(b => console.log(`  [${b.id}] userId: ${b.userId} | ${b.amount} | ${b.month}/${b.year}`));

  console.log('\n===========================================\n');
}

main()
  .catch(e => console.error('Xato:', e.message))
  .finally(() => prisma.$disconnect());

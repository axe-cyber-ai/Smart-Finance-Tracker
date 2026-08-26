import { PrismaClient } from '@prisma/client';
import { stringify } from 'csv-stringify';
import { AppError } from '../utils/AppError.js';

const prisma = new PrismaClient();

export class TransactionService {
  /**
   * Resolves or creates a category by name for a user
   */
  static async resolveCategory(userId, categoryId, categoryName, type = 'expense') {
    if (categoryName && categoryName.trim() !== '') {
      const name = categoryName.trim();

      let category = await prisma.category.findFirst({
        where: { userId, name },
      });

      if (!category) {
        category = await prisma.category.findFirst({
          where: { userId: null, name },
        });
      }

      if (!category) {
        category = await prisma.category.create({
          data: {
            userId,
            name,
            type,
            icon: 'tag',
            color: '#10B981',
          },
        });
      }

      return category.id;
    }

    if (categoryId) {
      const parsedId = parseInt(categoryId, 10);
      const validCat = await prisma.category.findFirst({
        where: {
          id: parsedId,
          OR: [{ userId: null }, { userId }],
        },
      });
      return validCat ? validCat.id : null;
    }

    return null;
  }

  static async getTransactions(userId, { type, categoryId, search, start_date, end_date, limit = 50, page = 1 }) {
    const where = { userId };

    if (type && ['income', 'expense'].includes(type)) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId, 10);
    }

    if (search && search.trim() !== '') {
      where.description = { contains: search.trim() };
    }

    if (start_date || end_date) {
      where.transactionDate = {};
      if (start_date) where.transactionDate.gte = new Date(start_date);
      if (end_date) where.transactionDate.lte = new Date(`${end_date}T23:59:59`);
    }

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        take,
        skip,
        orderBy: [{ transactionDate: 'desc' }, { id: 'desc' }],
        include: { category: { select: { id: true, name: true, color: true, type: true, icon: true } } },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  static async getTransactionById(userId, id) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id, 10), userId },
      include: { category: true },
    });

    if (!transaction) {
      throw new AppError("Tranzaksiya topilmadi.", 404);
    }

    return transaction;
  }

  static async createTransaction(userId, data) {
    let categoryId = data.categoryId;
    if (!categoryId && data.category_name) {
      categoryId = await this.resolveCategory(userId, null, data.category_name, data.type);
    }

    if (!categoryId) {
      throw new AppError("Tranzaksiya uchun kategoriya tanlanishi yoki kiritilishi shart.", 400);
    }

    return await prisma.transaction.create({
      data: {
        userId,
        categoryId: parseInt(categoryId, 10),
        type: data.type,
        amount: parseFloat(data.amount),
        description: data.description || '',
        transactionDate: data.transactionDate || data.transaction_date ? new Date(data.transactionDate || data.transaction_date) : new Date(),
      },
      include: { category: true },
    });
  }

  static async updateTransaction(userId, id, data) {
    const existing = await this.getTransactionById(userId, id);

    let categoryId = data.categoryId;
    if (!categoryId && data.category_name) {
      categoryId = await this.resolveCategory(userId, null, data.category_name, data.type || existing.type);
    }

    return await prisma.transaction.update({
      where: { id: existing.id },
      data: {
        categoryId: categoryId ? parseInt(categoryId, 10) : existing.categoryId,
        type: data.type || existing.type,
        amount: data.amount ? parseFloat(data.amount) : existing.amount,
        description: data.description !== undefined ? data.description : existing.description,
        transactionDate: data.transactionDate || data.transaction_date ? new Date(data.transactionDate || data.transaction_date) : existing.transactionDate,
      },
      include: { category: true },
    });
  }

  static async deleteTransaction(userId, id) {
    const existing = await this.getTransactionById(userId, id);
    await prisma.transaction.delete({ where: { id: existing.id } });
    return true;
  }

  static async exportCsv(userId) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { transactionDate: 'desc' },
    });

    const records = transactions.map((t) => [
      t.id,
      t.type === 'income' ? 'Daromad' : 'Xarajat',
      t.amount,
      t.category ? t.category.name : '',
      t.description || '',
      t.transactionDate.toISOString().split('T')[0],
    ]);

    return new Promise((resolve, reject) => {
      stringify(
        records,
        {
          header: true,
          columns: ['ID', 'Turi', 'Summa', 'Kategoriya', 'Izoh', 'Sana'],
        },
        (err, output) => {
          if (err) return reject(new AppError("CSV hosil qilishda xatolik.", 500));
          resolve(output);
        }
      );
    });
  }
}

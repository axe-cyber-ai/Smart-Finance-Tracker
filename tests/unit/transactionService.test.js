import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindMany, mockFindFirst, mockCreate, mockCount, mockDelete } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockFindFirst: vi.fn(),
  mockCreate: vi.fn(),
  mockCount: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    transaction = {
      findMany: mockFindMany,
      findFirst: mockFindFirst,
      create: mockCreate,
      count: mockCount,
      delete: mockDelete,
    };
    category = {
      findFirst: mockFindFirst,
      create: mockCreate,
    };
  },
}));

import { TransactionService } from '../../src/services/transactionService.js';

describe('TransactionService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('should return paginated list of transactions', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 1, amount: 150000, description: 'Supermarket' },
      ]);
      mockCount.mockResolvedValueOnce(1);

      const result = await TransactionService.getTransactions(1, { page: 1, limit: 10 });
      expect(result.transactions).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('createTransaction', () => {
    it('should create new transaction with categoryId', async () => {
      mockCreate.mockResolvedValueOnce({
        id: 10,
        userId: 1,
        categoryId: 2,
        amount: 250000,
        type: 'expense',
      });

      const tx = await TransactionService.createTransaction(1, { categoryId: 2, amount: 250000, type: 'expense' });
      expect(tx.id).toBe(10);
      expect(tx.amount).toBe(250000);
    });
  });
});

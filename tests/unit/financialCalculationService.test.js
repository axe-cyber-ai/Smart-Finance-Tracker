import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockAggregate, mockFindMany } = vi.hoisted(() => ({
  mockAggregate: vi.fn(),
  mockFindMany: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    transaction = {
      aggregate: mockAggregate,
      findMany: mockFindMany,
    };
    budget = {
      findMany: mockFindMany,
    };
  },
}));

import { FinancialCalculationService } from '../../src/services/financialCalculationService.js';

describe('FinancialCalculationService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTotalIncome', () => {
    it('should calculate total income for user', async () => {
      mockAggregate.mockResolvedValueOnce({ _sum: { amount: 500000 } });

      const income = await FinancialCalculationService.getTotalIncome(1, 8, 2026);
      expect(income).toBe(500000);
    });

    it('should return 0 if no income found', async () => {
      mockAggregate.mockResolvedValueOnce({ _sum: { amount: null } });

      const income = await FinancialCalculationService.getTotalIncome(1);
      expect(income).toBe(0);
    });
  });

  describe('getTotalExpense', () => {
    it('should calculate total expense for user', async () => {
      mockAggregate.mockResolvedValueOnce({ _sum: { amount: 200000 } });

      const expense = await FinancialCalculationService.getTotalExpense(1, 8, 2026);
      expect(expense).toBe(200000);
    });
  });

  describe('getBalance', () => {
    it('should return net balance (income - expense)', async () => {
      vi.spyOn(FinancialCalculationService, 'getTotalIncome').mockResolvedValue(1000000);
      vi.spyOn(FinancialCalculationService, 'getTotalExpense').mockResolvedValue(400000);

      const balance = await FinancialCalculationService.getBalance(1);
      expect(balance).toBe(600000);
    });
  });

  describe('getCategoryBreakdown', () => {
    it('should group transactions by category and calculate percentages', async () => {
      mockFindMany.mockResolvedValueOnce([
        { categoryId: 1, amount: 600000, category: { name: 'Oziq-ovqat', color: '#FF0000', icon: 'cart' } },
        { categoryId: 2, amount: 400000, category: { name: 'Transport', color: '#00FF00', icon: 'bus' } },
      ]);

      const breakdown = await FinancialCalculationService.getCategoryBreakdown(1, 8, 2026);
      expect(breakdown.total_expense).toBe(1000000);
      expect(breakdown.categories).toHaveLength(2);
      expect(breakdown.categories[0].category_name).toBe('Oziq-ovqat');
      expect(breakdown.categories[0].percentage).toBe(60);
      expect(breakdown.categories[1].percentage).toBe(40);
    });
  });
});

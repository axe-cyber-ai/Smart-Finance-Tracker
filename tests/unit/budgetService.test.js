import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindFirst, mockCreate, mockUpdate, mockDelete } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    budget = {
      findFirst: mockFindFirst,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    };
    category = {
      findMany: vi.fn().mockResolvedValue([]),
    };
  },
}));

import { BudgetService } from '../../src/services/budgetService.js';

describe('BudgetService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create new budget', async () => {
    mockFindFirst.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValueOnce({ id: 1, userId: 1, amount: 2000000, month: 8, year: 2026 });

    const budget = await BudgetService.createOrUpdateBudget(1, { amount: 2000000, month: 8, year: 2026 });
    expect(budget.amount).toBe(2000000);
  });

  it('should delete budget', async () => {
    mockFindFirst.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockDelete.mockResolvedValueOnce(true);

    const res = await BudgetService.deleteBudget(1, 1);
    expect(res).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindMany, mockFindFirst, mockCreate, mockUpdate, mockDelete, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockFindFirst: vi.fn(),
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    category = {
      findMany: mockFindMany,
      findFirst: mockFindFirst,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    };
    transaction = {
      count: mockCount,
    };
  },
}));

import { CategoryService } from '../../src/services/categoryService.js';

describe('CategoryService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch system and user categories', async () => {
    mockFindMany.mockResolvedValueOnce([{ id: 1, name: 'Maosh', userId: null }]);
    mockFindMany.mockResolvedValueOnce([{ id: 2, name: 'Kitoblar', userId: 5 }]);

    const result = await CategoryService.getSystemAndUserCategories(5);
    expect(result.systemCategories).toHaveLength(1);
    expect(result.userCategories).toHaveLength(1);
  });

  it('should create new category for user', async () => {
    mockCreate.mockResolvedValueOnce({ id: 3, name: 'Taksi', type: 'expense', userId: 5 });

    const created = await CategoryService.createCategory(5, { name: 'Taksi', type: 'expense' });
    expect(created.id).toBe(3);
    expect(created.name).toBe('Taksi');
  });

  it('should delete category if no transactions attached', async () => {
    mockFindFirst.mockResolvedValueOnce({ id: 3, userId: 5 });
    mockCount.mockResolvedValueOnce(0);
    mockDelete.mockResolvedValueOnce(true);

    const res = await CategoryService.deleteCategory(5, 3);
    expect(res).toBe(true);
  });
});

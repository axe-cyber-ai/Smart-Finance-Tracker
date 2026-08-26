import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

const { mockUserFindUnique, mockUserCreate, mockUserUpdate } = vi.hoisted(() => ({
  mockUserFindUnique: vi.fn(),
  mockUserCreate: vi.fn(),
  mockUserUpdate: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    user = {
      findUnique: mockUserFindUnique,
      create: mockUserCreate,
      update: mockUserUpdate,
    };
  },
}));

import { UserService } from '../../src/services/userService.js';

describe('UserService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);

      mockUserFindUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Ali',
        email: 'ali@example.com',
        password: hashedPassword,
        role: 'user',
      });

      const user = await UserService.authenticateUser('ali@example.com', 'secret123');
      expect(user.id).toBe(1);
      expect(user.name).toBe('Ali');
    });

    it('should throw AppError on invalid password', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);

      mockUserFindUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Ali',
        email: 'ali@example.com',
        password: hashedPassword,
        role: 'user',
      });

      await expect(UserService.authenticateUser('ali@example.com', 'wrongpass')).rejects.toThrow(
        "Kiritilgan login yoki parol noto'g'ri."
      );
    });
  });
});

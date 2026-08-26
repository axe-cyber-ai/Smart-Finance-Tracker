import { describe, it, expect, vi } from 'vitest';
import { AiFinanceService } from '../../src/services/aiFinanceService.js';
import { FinancialCalculationService } from '../../src/services/financialCalculationService.js';

describe('AiFinanceService Heuristic Analysis Unit Tests', () => {
  it('should generate financial analysis report using heuristic rule fallback', async () => {
    vi.spyOn(FinancialCalculationService, 'getTotalIncome').mockResolvedValue(10000000);
    vi.spyOn(FinancialCalculationService, 'getTotalExpense').mockResolvedValue(4000000);
    vi.spyOn(FinancialCalculationService, 'getBalance').mockResolvedValue(6000000);
    vi.spyOn(FinancialCalculationService, 'getCategoryBreakdown').mockResolvedValue({
      total_expense: 4000000,
      categories: [
        { category_id: 1, category_name: 'Oziq-ovqat', amount: 2500000, percentage: 62.5 },
      ],
    });
    vi.spyOn(FinancialCalculationService, 'getBudgetStatus').mockResolvedValue({
      overall: { status: 'normal', percentage: 40 },
      categories: [],
    });

    const user = { id: 1, name: 'Ali' };
    const analysis = await AiFinanceService.analyzeFinancialHealth(user);

    expect(analysis).toHaveProperty('financial_score');
    expect(analysis.financial_score).toBeGreaterThanOrEqual(10);
    expect(analysis.financial_score).toBeLessThanOrEqual(100);
    expect(analysis).toHaveProperty('anomalies');
    expect(analysis).toHaveProperty('savings_tip');
    expect(analysis).toHaveProperty('markdown_report');
    expect(analysis.markdown_report).toContain('Moliyaviy Salomatlik Tahlili');
  });
});

import { asyncHandler } from '../utils/asyncHandler.js';
import { BudgetService } from '../services/budgetService.js';

export const index = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const now = new Date();
  const month = parseInt(req.query.month, 10) || (now.getMonth() + 1);
  const year = parseInt(req.query.year, 10) || now.getFullYear();

  const { budgetStatus, categories } = await BudgetService.getBudgetOverview(userId, month, year);

  res.render('budgets/index', {
    title: 'Byudjet Rejalashtirish',
    budgetStatus,
    categories,
    month,
    year,
  });
});

export const store = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await BudgetService.createOrUpdateBudget(userId, req.body);
  req.session.success = 'Byudjet muvaffaqiyatli saqlandi.';

  const m = req.body.month || (new Date().getMonth() + 1);
  const y = req.body.year || new Date().getFullYear();
  res.redirect(`/budgets?month=${m}&year=${y}`);
});

export const update = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await BudgetService.updateBudget(userId, req.params.id, req.body);
  req.session.success = 'Byudjet muvaffaqiyatli yangilandi.';
  res.redirect('/budgets');
});

export const destroy = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await BudgetService.deleteBudget(userId, req.params.id);
  req.session.success = "Byudjet muvaffaqiyatli o'chirildi.";
  res.redirect('/budgets');
});

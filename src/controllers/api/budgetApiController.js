import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { BudgetService } from '../../services/budgetService.js';

export const apiGetBudgets = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const now = new Date();
  const month = parseInt(req.query.month, 10) || (now.getMonth() + 1);
  const year = parseInt(req.query.year, 10) || now.getFullYear();

  const overview = await BudgetService.getBudgetOverview(userId, month, year);
  return sendSuccess(res, 200, "Byudjet rejalari olindi.", {
    month,
    year,
    ...overview,
  });
});

export const apiCreateBudget = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const budget = await BudgetService.createOrUpdateBudget(userId, req.body);
  return sendSuccess(res, 201, "Byudjet saqlandi.", budget);
});

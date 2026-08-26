import { asyncHandler } from '../utils/asyncHandler.js';
import { TransactionService } from '../services/transactionService.js';
import { CategoryService } from '../services/categoryService.js';

export const index = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const page = parseInt(req.query.page, 10) || 1;

  const [{ transactions, pagination }, categories] = await Promise.all([
    TransactionService.getTransactions(userId, { ...req.query, limit: 15, page }),
    CategoryService.getCategories(userId),
  ]);

  res.render('transactions/index', {
    title: 'Tranzaksiyalar',
    transactions,
    categories,
    query: req.query,
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      totalCount: pagination.total,
    },
  });
});

export const store = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await TransactionService.createTransaction(userId, req.body);
  req.session.success = "Tranzaksiya muvaffaqiyatli qo'shildi.";
  res.redirect('back');
});

export const update = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await TransactionService.updateTransaction(userId, req.params.id, req.body);
  req.session.success = 'Tranzaksiya muvaffaqiyatli yangilandi.';
  res.redirect('/transactions');
});

export const destroy = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await TransactionService.deleteTransaction(userId, req.params.id);
  req.session.success = "Tranzaksiya muvaffaqiyatli o'chirildi.";
  res.redirect('/transactions');
});

export const exportCsv = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const csvData = await TransactionService.exportCsv(userId);

  res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
  res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.csv`);
  res.write('\uFEFF'); // UTF-8 BOM
  return res.status(200).send(csvData);
});

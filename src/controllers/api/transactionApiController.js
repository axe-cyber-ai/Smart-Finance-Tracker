import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { TransactionService } from '../../services/transactionService.js';

export const apiGetTransactions = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const result = await TransactionService.getTransactions(userId, req.query);
  return sendSuccess(res, 200, "Tranzaksiyalar ro'yxati olindi.", result);
});

export const apiGetTransactionById = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const transaction = await TransactionService.getTransactionById(userId, req.params.id);
  return sendSuccess(res, 200, "Tranzaksiya tafsilotlari olindi.", transaction);
});

export const apiCreateTransaction = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const transaction = await TransactionService.createTransaction(userId, req.body);
  return sendSuccess(res, 201, "Tranzaksiya muvaffaqiyatli yaratildi.", transaction);
});

export const apiUpdateTransaction = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const updated = await TransactionService.updateTransaction(userId, req.params.id, req.body);
  return sendSuccess(res, 200, "Tranzaksiya yangilandi.", updated);
});

export const apiDeleteTransaction = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await TransactionService.deleteTransaction(userId, req.params.id);
  return sendSuccess(res, 200, "Tranzaksiya o'chirildi.");
});

export const apiExportCsv = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const csvData = await TransactionService.exportCsv(userId);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=transactions-${Date.now()}.csv`);
  return res.status(200).send(csvData);
});

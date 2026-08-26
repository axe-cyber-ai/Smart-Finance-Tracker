import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { CategoryService } from '../../services/categoryService.js';

export const apiGetCategories = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const categories = await CategoryService.getCategories(userId);
  return sendSuccess(res, 200, "Kategoriyalar ro'yxati olindi.", categories);
});

export const apiCreateCategory = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const category = await CategoryService.createCategory(userId, req.body);
  return sendSuccess(res, 201, "Yangi kategoriya yaratildi.", category);
});

export const apiUpdateCategory = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const updated = await CategoryService.updateCategory(userId, req.params.id, req.body);
  return sendSuccess(res, 200, "Kategoriya yangilandi.", updated);
});

export const apiDeleteCategory = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await CategoryService.deleteCategory(userId, req.params.id);
  return sendSuccess(res, 200, "Kategoriya o'chirildi.");
});

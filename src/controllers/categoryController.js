import { asyncHandler } from '../utils/asyncHandler.js';
import { CategoryService } from '../services/categoryService.js';

export const index = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const { systemCategories, userCategories } = await CategoryService.getSystemAndUserCategories(userId);

  res.render('categories/index', {
    title: 'Kategoriyalar',
    systemCategories,
    userCategories,
  });
});

export const store = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await CategoryService.createCategory(userId, req.body);
  req.session.success = 'Yangi kategoriya muvaffaqiyatli yaratildi.';
  res.redirect('/categories');
});

export const update = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await CategoryService.updateCategory(userId, req.params.id, req.body);
  req.session.success = 'Kategoriya muvaffaqiyatli yangilandi.';
  res.redirect('/categories');
});

export const destroy = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  await CategoryService.deleteCategory(userId, req.params.id);
  req.session.success = "Kategoriya muvaffaqiyatli o'chirildi.";
  res.redirect('/categories');
});

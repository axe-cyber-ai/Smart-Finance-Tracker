import { asyncHandler } from '../utils/asyncHandler.js';
import { UserService } from '../services/userService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const edit = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.session.user.id },
  });

  res.render('profile/edit', {
    title: 'Profil Sozlamalari',
    user,
  });
});

export const update = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const { name, email, current_password, password } = req.body;

  const updatedUser = await UserService.updateProfile(userId, name, email);
  req.session.user.name = updatedUser.name;
  req.session.user.email = updatedUser.email;

  if (password && password.trim() !== '') {
    if (!current_password) {
      req.session.error = "Parolni o'zgartirish uchun hozirgi parolingizni kiriting.";
      return res.redirect('/profile');
    }
    await UserService.updatePassword(userId, current_password, password);
  }

  req.session.success = "Profil ma'lumotlari muvaffaqiyatli yangilandi.";
  res.redirect('/profile');
});

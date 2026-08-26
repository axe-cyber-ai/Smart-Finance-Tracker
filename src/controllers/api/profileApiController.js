import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { UserService } from '../../services/userService.js';

export const apiUpdateProfile = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const { name, email } = req.body;

  const updatedUser = await UserService.updateProfile(userId, name, email);
  req.session.user.name = updatedUser.name;
  req.session.user.email = updatedUser.email;

  return sendSuccess(res, 200, "Profil yangilandi.", updatedUser);
});

export const apiUpdatePassword = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const { currentPassword, newPassword } = req.body;

  await UserService.updatePassword(userId, currentPassword, newPassword);
  return sendSuccess(res, 200, "Parol muvaffaqiyatli o'zgartirildi.");
});

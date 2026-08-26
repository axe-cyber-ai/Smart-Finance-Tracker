import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { UserService } from '../../services/userService.js';

export const apiLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserService.authenticateUser(email, password);

  req.session.user = user;
  return sendSuccess(res, 200, "Tizimga muvaffaqiyatli kirdingiz.", { user });
});

export const apiRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await UserService.registerUser(name, email, password);

  req.session.user = user;
  return sendSuccess(res, 201, "Akkaunt muvaffaqiyatli yaratildi.", { user });
});

export const apiLogout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    return sendSuccess(res, 200, "Tizimdan chiqildi.");
  });
});

export const apiGetMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, "Foydalanuvchi ma'lumotlari.", req.session.user);
});

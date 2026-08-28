import { asyncHandler } from '../utils/asyncHandler.js';
import { UserService } from '../services/userService.js';

export const showLogin = (req, res) => {
  res.render('auth/login', { layout: 'layouts/guest', title: 'Tizimga kirish' });
};

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserService.authenticateUser(email, password);

  req.session.user = user;
  req.session.success = `Xush kelibsiz, ${user.name}! Tizimga muvaffaqiyatli kirdingiz.`;

  req.session.save((err) => {
    if (err) return next(err);
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/dashboard');
  });
});

export const showRegister = (req, res) => {
  res.render('auth/register', { layout: 'layouts/guest', title: "Ro'yxatdan o'tish" });
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, password_confirmation } = req.body;

  if (password_confirmation && password !== password_confirmation) {
    req.session.error = 'Parollar mos kelmadi.';
    return res.redirect('/register');
  }

  const user = await UserService.registerUser(name, email, password);

  req.session.user = user;
  req.session.success = "Akkaunt muvaffaqiyatli yaratildi! Smart Finance Tracker'ga xush kelibsiz.";

  req.session.save((err) => {
    if (err) return next(err);
    return res.redirect('/dashboard');
  });
});

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

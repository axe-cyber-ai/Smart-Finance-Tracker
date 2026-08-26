export const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    req.session.error = 'Admin panelga kirish uchun tizimga kiring.';
    return res.redirect('/login');
  }

  if (req.session.user.role !== 'admin') {
    req.session.error = 'Ruxsat rad etildi. Ushbu bo\'lim faqat Administratorlar uchun.';
    return res.redirect('/dashboard');
  }

  next();
};

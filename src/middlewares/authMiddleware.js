export const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.session.error = "Tizimga kirish majburiy. Iltimos, davom etish uchun login va parolingizni kiriting.";
    return res.redirect('/login');
  }
  res.locals.user = req.session.user;
  next();
};

export const requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};

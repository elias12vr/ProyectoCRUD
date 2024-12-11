module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
      return next(); // Usuario autenticado
  }
  res.redirect('/auth/login'); // Redirigir si no está autenticado
};

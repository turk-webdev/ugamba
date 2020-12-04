module.exports = (req, res, next) => {
  if (req.isUnauthenticated()) {
    return res.render('error');
  }
  next();
};

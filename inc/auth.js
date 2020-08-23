module.exports = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    req.flash("message", { msg: "You must login first" })
    req.session.save(() => {
      return res.redirect("/")
    })
  }
}

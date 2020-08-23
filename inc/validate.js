const { body, validationResult } = require("express-validator")

exports.validateSignUp = [
  body("name", "Name min characters is 2").isLength({ min: 2 }).trim().escape(),
  body("email", "Email is not valid").isEmail().normalizeEmail(),
  body("password", "Password min characters is 6").isLength({ min: 6 }).trim().escape(),
  body("passwordAgain").custom((value, { req, loc, path }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords don't match")
    } else {
      return true
    }
  }),
  body("agreed", "You need to agre to our TOS").isIn(["on"]),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("message", errors.array())
      req.session.save(() => res.redirect("/user/signup"))
    } else {
      next()
    }
  },
]

exports.validateSignIn = [
  body("email", "Email is not valid").isEmail().normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("message", errors.array())
      req.session.save(() => res.redirect("/user/signin"))
    } else {
      next()
    }
  },
]

exports.validateProfileUpdate = [
  body("name", "Name min characters is 2").isLength({ min: 2 }).trim().escape(),
  body("email", "Email is not valid").isEmail().normalizeEmail(),
  body("password", "Password is required").not().isEmpty().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("message", errors.array())
      req.session.save(() => res.redirect("/user/profile/"))
    } else {
      next()
    }
  },
]

exports.validateProfilePasswordUpdate = [
  body("oldpassword", "Current Password is required").not().isEmpty().trim().escape(),
  body("newPassword", "New Password min characters is 6").isLength({ min: 6 }).trim().escape(),
  body("passwordAgain").custom((value, { req, loc, path }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords don't match")
    } else {
      return true
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("message", errors.array())
      req.session.save(() => res.redirect("/user/profile"))
    } else {
      next()
    }
  },
]

exports.validateCreatePost = [
  body("content", "Post content is empty").not().isEmpty().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("message", errors.array())
      req.session.save(() => res.redirect("/post/create"))
    } else {
      next()
    }
  },
]

exports.validateEditPost = [
  body("content", "Content is empty").not().isEmpty().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash("message", errors.array())
      req.session.save(() => res.redirect("/"))
    } else {
      next()
    }
  },
]

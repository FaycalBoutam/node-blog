const express = require("express")
const router = express.Router()
const Auth = require("../inc/auth")
const userController = require("../controllers/usersController")
const { validateSignUp, validateSignIn, validateProfileUpdate, validateProfilePasswordUpdate } = require("../inc/validate")

// @route  GET /user/signup
// @desc   Get registeration page
// @access Public
router.get("/signup", userController.GetSignUp)

// @route  GET /user/signin
// @desc   Get Login page
// @access Public
router.get("/signin", userController.GetSignIn)

// @route  POST /user/process
// @desc   Register a new user
// @access Public
router.post("/process-signup", validateSignUp, userController.signUp)

// @route  POST /user/signin
// @desc   User login
// @access Public
router.post("/process-signin", validateSignIn, userController.signIn)

// @route  POST /user/signout
// @desc   User log out
// @access Private
router.post("/signout", userController.signOut)

// @route  GET /user/profile/:id
// @desc   Get profile page
// @access Private
router.get("/profile/", Auth, userController.GetProfile)

// @route  POST /user/profile/:id/update
// @desc   Update profile (name & email)
// @access Private
router.post("/profile/process-update", [Auth, validateProfileUpdate], userController.updateProfile)

// @route  POST /user/profile/process-password-update
// @desc   Update profile (password)
// @access Private
router.post("/profile/process-password-update", [Auth, validateProfilePasswordUpdate], userController.updateProfilePassword)

module.exports = router

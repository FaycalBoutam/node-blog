const userModel = require("../models/usersModel")
const bcrypt = require("bcryptjs")

// get register page
exports.GetSignUp = (req, res) => {
  res.render("register", { title: "Register" })
}

// get login page
exports.GetSignIn = (req, res) => {
  res.render("login", { title: "Login" })
}

// register
exports.signUp = async (req, res) => {
  const { name, email, password } = req.body

  const userFound = await userModel.findOne({ email })
  if (userFound) {
    req.flash("message", { msg: "A user with this email already exist" })
    req.session.save(() => res.redirect("/user/signup"))
  } else {
    const salt = await bcrypt.genSaltSync(10)
    const hashed = await bcrypt.hash(password, salt)

    user = new userModel({
      name,
      email,
      password: hashed,
    })
    const savedUser = await user.save()
    if (!savedUser) {
      req.flash("message", { msg: "Error in saving user, please try again later" })
      req.session.save(() => res.redirect("/user/signup"))
    } else {
      savedUser.password = undefined
      req.session.user = { color: "red", user: savedUser }
      req.flash("message", { success: "Thank you for registring" })
      req.session.save(() => res.redirect("/"))
    }
  }
}

// login
exports.signIn = async (req, res) => {
  const { email, password } = req.body

  const userWithEmailFound = await userModel.findOne({ email })
  if (!userWithEmailFound) {
    req.flash("message", { msg: "Incorrect email or password" })
    req.session.save(() => res.redirect("/user/signin"))
  } else {
    const isMatch = await bcrypt.compare(password, userWithEmailFound.password)
    if (!isMatch) {
      req.flash("message", { msg: "Incorrect email or password" })
      req.session.save(() => res.redirect("/user/signin"))
    } else {
      userWithEmailFound.password = undefined
      req.session.user = { color: "red", user: userWithEmailFound }
      req.session.save(() => res.redirect("/"))
    }
  }
}

// log out
exports.signOut = (req, res) => {
  req.session.destroy(() => res.redirect("/"))
}

// get profile page
exports.GetProfile = async (req, res) => {
  const userProfile = await userModel.findOne({ _id: req.visitorId })
  if (!userProfile) {
    req.flash("message", { msg: "No user was found" })
    req.session.save(() => res.redirect("/"))
  } else {
    userProfile.password = undefined
    res.render("profile", { userProfile, title: "Profile" })
  }
}

// update profile (name & email)
exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body
  const userId = req.visitorId

  const userFound = await userModel.findOne({ _id: userId })
  if (!userFound) {
    req.flash("message", { msg: "Error getting user" })
    req.session.save(() => res.redirect("/user/profile"))
  } else {
    const isMatch = await bcrypt.compare(password, userFound.password)
    if (!isMatch) {
      req.flash("message", { msg: "Incorrect password" })
      req.session.save(() => res.redirect("/user/profile"))
    } else {
      const userUpdated = await userModel.findOneAndUpdate({ _id: userId }, { name, email })
      if (!userUpdated) {
        req.flash("message", { msg: "Error saving user" })
        req.session.save(() => res.redirect("/user/profile"))
      } else {
        req.flash("message", { success: "Profile is updated successflly" })
        req.session.save(() => res.redirect("/user/profile"))
      }
    }
  }
}

// update user password
exports.updateProfilePassword = async (req, res) => {
  const { oldpassword, newPassword } = req.body

  const userFound = await userModel.findOne({ _id: req.visitorId })
  if (!userFound) {
    req.flash("message", { msg: "Error finding user" })
    req.session.save(() => res.redirect("/user/profile"))
  } else {
    const isMatch = await bcrypt.compare(oldpassword, userFound.password)
    if (!isMatch) {
      req.flash("message", { msg: "Password is incorrect" })
      req.session.save(() => res.redirect("/user/profile"))
    } else {
      const salt = await bcrypt.genSaltSync(10)
      const hashed = await bcrypt.hash(newPassword, salt)
      const userUpdated = await userModel.findOneAndUpdate({ _id: req.visitorId }, { password: hashed })
      if (!userUpdated) {
        req.flash("message", { msg: "Error updating user" })
        req.session.save(() => res.redirect("/user/profile"))
      }
      req.flash("message", { success: "Password is updated successfully" })
      req.session.save(() => res.redirect("/user/profile"))
    }
  }
}

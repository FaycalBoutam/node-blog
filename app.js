const express = require("express")
const app = express()
const csrf = require("csurf")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
const markDown = require("marked")
require("dotenv").config()
const db = require("./inc/db")
const usersRouter = require("./routes/usersRoute")
const poststRouter = require("./routes/postsRoute")
const postModel = require("./models/postsModel")
// const cors = require("cors")

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))

app.use(
  session({
    secret: "erqaslmkocgsofc",
    store: new MongoStore({ mongooseConnection: db }),
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
    resave: false,
    saveUninitialized: false,
  })
)

app.use(flash())
// app.use(cors())

app.use(csrf())
app.use((req, res, next) => {
  res.locals.filterHTML = (content) => markDown(content)
  res.locals.csrfToken = req.csrfToken()
  res.locals.flash = { message: req.flash("message") }
  res.locals.user = req.session.user
  req.session.user ? (req.visitorId = req.session.user.user._id) : 0
  next()
})

// index route
app.get("/", async (req, res) => {
  const posts = await postModel.find().populate("user", "name").sort({ date: "desc" })
  res.render("index", { posts, title: "Index" })
})
// tos route
app.get("/tos", async (req, res) => {
  res.render("tos", { title: "Terms of Service" })
})

app.use("/user", usersRouter)
app.use("/post", poststRouter)

app.listen(process.env.PORT)

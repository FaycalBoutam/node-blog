const mongoose = require("mongoose")

mongoose.connect(process.env.CONNECTIONSTRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

mongoose.connection.on("connected", () => {
  console.log("! Connected to DB !")
})
mongoose.connection.on("error", () => {
  console.log("!! DB Connection ERROR !!")
})

module.exports = mongoose.connection

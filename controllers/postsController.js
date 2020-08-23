const postModel = require("../models/postsModel")

// get create new page
exports.GetCreatePost = (req, res) => {
  res.render("create-post", { title: "Create Post" })
}

// view post
exports.ViewPost = async (req, res) => {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user", "name")
  if (!post) {
    res.render("not_found", { title: "404" })
  } else {
    post.views++
    await post.save()
    res.render("single", { post, title: "Post" })
  }
}

// create new post
exports.CreatePost = async (req, res) => {
  const { title, content } = req.body

  const post = new postModel({
    title,
    content,
    user: req.visitorId,
  })

  const postSaved = await post.save()
  if (!postSaved) {
    req.flash("message", { msg: "Error in saving post, please try again later" })
    req.session.save(() => res.redirect("/post/create"))
  } else {
    req.flash("message", { success: "Post created successfully" })
    req.session.save(() => res.redirect(`/post/${postSaved._id}`))
  }
}

// view edit post page
exports.ViewEditPost = async (req, res) => {
  const post = await postModel.findOne({ _id: req.params.id, user: req.visitorId })
  if (!post) {
    req.flash("message", { msg: "Post not found" })
    req.session.save(() => res.redirect("/"))
  } else {
    res.render("edit-post", { post, title: "Edit Post" })
  }
}

// edit post
exports.EditPost = async (req, res) => {
  const { title, content } = req.body
  const postId = req.params.id

  const postUpdated = await postModel.findOneAndUpdate({ _id: postId, user: req.visitorId }, { title, content })
  if (!postUpdated) {
    req.flash("message", { msg: "Error updating post" })
    req.session.save(() => res.redirect("/"))
  } else {
    req.flash("message", { success: "Post is updated successflly" })
    req.session.save(() => res.redirect(`/post/${postId}`))
  }
}

// delete post
exports.DeletePost = async (req, res) => {
  postModel.deleteOne({ _id: req.params.id, user: req.visitorId }, function (err) {
    if (err) return handleError(err)
    req.flash("message", { success: "Post is deleted successflly" })
    req.session.save(() => res.redirect("/"))
  })
}

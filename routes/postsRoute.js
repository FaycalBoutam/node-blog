const express = require("express")
const router = express.Router()
const postController = require("../controllers/postsController")
const Auth = require("../inc/auth")
const { validateCreatePost, validateEditPost } = require("../inc/validate")

// @route  GET /post/create
// @desc   Get create new page
// @access Private
router.get("/create", Auth, postController.GetCreatePost)

// @route  POST /post/create
// @desc   Create new post
// @access Private
router.post("/process-create-post", validateCreatePost, postController.CreatePost)

// @route  GET /post/:id/edit
// @desc   Edit post
// @access Private
router.get("/:id/edit", postController.ViewEditPost)

// @route  POST /post/:id/edit
// @desc   Edit post
// @access Private
router.post("/:id/process-edit-post", [Auth, validateEditPost], postController.EditPost)

// @route  GET /post/:id
// @desc   Show post
// @access Public
router.get("/:id", postController.ViewPost)

// @route  POST /post/:id/remove
// @desc   Delete post
// @access Private
router.post("/:id/remove", Auth, postController.DeletePost)

// @route  POST /post/my-posts
// @desc   Get all posts by user
// @access Private
// router.post("/my-posts", Auth, postController.ViewAllByUser)

// @route  GET /post/:shortUrl
// @desc   Get post by shortUrl
// @access Public
// router.get("/:shortUrl", postController.ViewSingle)

module.exports = router

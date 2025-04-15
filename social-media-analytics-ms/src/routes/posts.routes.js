const { Router } = require("express");
const postsController = require("../controllers/posts.controller");

const postRouter = Router();

postRouter.get("/", postsController.getPosts);

module.exports = postRouter;
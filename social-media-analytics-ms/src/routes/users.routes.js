const { Router } = require("express");
const userController = require("../controllers/users.controller");

const userRouter = Router();

userRouter.get("/", userController.getTopUsers);

module.exports = userRouter;
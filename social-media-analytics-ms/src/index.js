const path = require("node:path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV?.trim()}`) });
const usersRouter = require("./routes/users.routes");
const postsRouter = require("./routes/posts.routes");

const PORT = process.env.PORT;
const app = express();

// Middlewares
app.use(cors({
    origin: "*",
    allowedHeaders: ["GET", "OPTIONS"],
}));

// Routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);


app.listen(PORT, (error) => {
    console.log(error ? `Error: ${error.message}` : `Server is listening on ${PORT}`);
});
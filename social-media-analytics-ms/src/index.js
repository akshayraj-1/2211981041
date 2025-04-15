const path = require("node:path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV?.trim()}`) });

const PORT = process.env.PORT;
const app = express();

// Middlerwares
app.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["GET", "OPTIONS"],
}));






app.listen(PORT, (error) => {
    console.log(error ? `Error: ${error.message}` : `Server is listening on ${PORT}`);
});
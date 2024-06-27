require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const indexRouter = require("./route/index-route");
const errorMiddleware = require("./middlewares/error-middleware");

const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(process.env.VERSION, indexRouter);

//database connect
mongoose.connect(process.env.DB).then(() => {
  console.log("Database connected successfully");
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log("Blog Application is running");
});

const express = require("express");
require("dotenv").config();
require("express-async-errors")
const app = express();
const connectDB = require("./db/connect");
const productRouter = require("./routes/products");

// middleware
app.use(express.json());

// server start
const port = process.env.PORT || 4000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`App is running on port ${port}`));
  } catch (error) {
    console.error(error);
  }
};
start();

app.get("/", (req, res) => {
  res.send("Store API project");
});

// Route for products
app.use("/api/v1/products", productRouter);

// Error handling middleware
const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error-handler");
app.use(notFoundMiddleware);
app.use(errorMiddleware);

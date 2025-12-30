const express = require("express");
const dotenv = require("dotenv");
const productsRouter = require("./productsRouter");
const connectDB = require("./db");
const { startInsertBidirectionalSync, stopSync } = require("./sync/insert");

dotenv.config();
const app = express();

app.use(express.json());
connectDB();
app.use("/api/v1/products", productsRouter);

app.use("/api/v1/_health", (req, res) => {
  res.send("success");
});

const port = process.env.PORT || 8000;
app.listen(port, async function () {
  console.log(`Started running in the port ${port}`);
  await startInsertBidirectionalSync();
});

process.on("SIGINT", async () => {
  console.log(" Shutting down...");
  await stopSync();
  process.exit(0);
});

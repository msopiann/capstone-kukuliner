const express = require("express");
const cors = require("cors");
const CulinaryRouter = require("./routes/kukulinerRoutes");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Kukuliner endpoint API using Express" });
});

app.use("/api/culinary", CulinaryRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  console.log("To stop server, press CTRL + C");
});

module.exports = app;

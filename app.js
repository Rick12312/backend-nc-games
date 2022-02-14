const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router.js");
const cors = require('cors')

app.use(cors())

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (err, req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;

require("./utils/instrumentation");

const path = require("path");
const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan");

const { initLogger } = require("@local/opentelemetry-js");
const indexRouter = require("./routes/index");

const app = express();
const logger = initLogger();

logger.info('Starting frontend application...');

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  logger.error(err);

  // render the error page
  res.status(err.status || 500);
  return res.render("error");
});

module.exports = app;

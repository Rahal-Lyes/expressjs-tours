const express = require("express");
const morgan = require("morgan");
const appError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all('*',(req,res,next)=>{

  next(new appError(`Can't find ${req.originalUrl} on this server`,404));
})

app.use(globalErrorHandler);


module.exports = app;

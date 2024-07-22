const express = require("express");
const morgan = require("morgan");
const cors=require("cors")
const bookRouter=require("./routes/bookRoutes");
const globalErrorHandler=require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();

app.use(morgan("dev"));


app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});




const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions))
  
  app.use("/api/books", bookRouter);
  
  app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
  });
  
app.use(globalErrorHandler);

module.exports=app;
require("dotenv").config();
require("express-async-errors");

//extra security
const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const port = 5000;
//db
const connectDB = require("./db/connect");
//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

//error handlers
const errorHandlerMiddleware = require("./middleware/error-handler");
const notExist = require("./middleware/not-exist");
//auth
const authenticationUser = require("./middleware/authentication");

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());

//routers
app.use("/api/v1/auth", authRouter); // gives the token
app.use("/api/v1/jobs", authenticationUser, jobsRouter); // dito ginagamit yung token para maaccess yung resources sa api/v1/jobs

//error handlers
app.use(notExist);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening at port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

//app <- routes <- controller (<- model <- mongoose)

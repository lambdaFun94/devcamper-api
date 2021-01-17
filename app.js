import "./config/env.js";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fileupload from "express-fileupload";
import "colors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

// Route  files
import coursesRoutes from "./routes/courses.js";
import bootcampsRoutes from "./routes/bootcamps.js";

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middlware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Upload files
app.use(fileupload());

// Set static folder
app.use(express.static(path.resolve(process.cwd(), "public")));

// Mount routers
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/bootcamps", bootcampsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});

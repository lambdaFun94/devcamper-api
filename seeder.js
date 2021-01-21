import "./config/env.js";
import "colors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { Bootcamp } from "./models/Bootcamp.js";
import { Course } from "./models/Course.js";
import { User } from "./models/User.js";
import { Review } from "./models/Review.js";

// Connect to db
let mongoURI = process.env.MONGO_URI_DEV;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON Files
const pathToBootcamps = path.resolve(process.cwd(), "_data/bootcamps.json");
const bootcamps = JSON.parse(fs.readFileSync(pathToBootcamps, "utf8"));

const pathToCourses = path.resolve(process.cwd(), "_data/courses.json");
const courses = JSON.parse(fs.readFileSync(pathToCourses, "utf8"));

const pathToUsers = path.resolve(process.cwd(), "_data/users.json");
const users = JSON.parse(fs.readFileSync(pathToUsers, "utf8"));

const pathToReviews = path.resolve(process.cwd(), "_data/reviews.json");
const reviews = JSON.parse(fs.readFileSync(pathToReviews, "utf8"));

// Write to db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log("Database seeded successfully".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-d") {
  deleteData();
} else if (process.argv[2] === "-i") {
  importData();
} else {
  deleteData();
  importData();
}

import "./config/env.js";
import "colors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { Bootcamp } from "./models/Bootcamp.js";
import { Course } from "./models/Course.js";

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON Files
const pathToBootcamps = path.resolve(process.cwd(), "_data/bootcamps.json");
const bootcamps = JSON.parse(fs.readFileSync(pathToBootcamps, "utf8"));

// Read JSON Files
const pathToCourses = path.resolve(process.cwd(), "_data/courses.json");
const courses = JSON.parse(fs.readFileSync(pathToCourses, "utf8"));

// Write to db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
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

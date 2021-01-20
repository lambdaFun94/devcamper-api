import mongoose from "mongoose";

// let mongoURI = process.env.MONGO_URI_DEV;
let mongoURI = process.env.MONGO_URI_DEV;
if (process.env.NODE_ENV === "production") {
  mongoURI = process.env.MONGO_URI;
}

export const connectDB = async () => {
  const conn = await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://echogest:echogestPI5@cluster0.sjdebtx.mongodb.net/echogest?appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;


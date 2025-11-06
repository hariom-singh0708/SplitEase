import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log(`🗄️ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;

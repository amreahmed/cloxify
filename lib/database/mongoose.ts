import mongoose, { connection, Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongooseConnection;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!MONGODB_URL) {
    throw new Error("Please define the MONGODB_URL environment variable inside .env.local");
  }

  if (!cached.promise) {
      cached.promise = cached.conn || mongoose.connect(MONGODB_URL,
          { dbName: "cloxify", bufferCommands: false });
      cached.conn = await cached.promise;
      return cached.conn;
  }
};

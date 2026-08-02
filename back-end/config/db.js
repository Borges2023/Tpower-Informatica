import "dotenv/config";
import mongoose from "mongoose";

const databaseUrl = process.env.MONGO_URI || process.env.MONGO_URL;
let connectionPromise;

mongoose.connection.on("error", (error) => {
  console.error("Erro de conexão com o MongoDB:", error.message);
});

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!databaseUrl) {
    const error = new Error("Configure MONGO_URI ou MONGO_URL no arquivo .env.");
    error.code = "DATABASE_UNAVAILABLE";
    throw error;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(databaseUrl, { serverSelectionTimeoutMS: 10000 })
      .then(() => console.log("Conectado ao MongoDB!"))
      .catch((error) => {
        connectionPromise = undefined;
        error.code = "DATABASE_UNAVAILABLE";
        throw error;
      });
  }

  await connectionPromise;
};


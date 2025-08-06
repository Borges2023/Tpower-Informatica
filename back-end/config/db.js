import "dotenv/config";
import mongoose from "mongoose";

const {
  MONGO_URL = "mongodb+srv://tpowerinformatica2016:ehYWhLcRyN8SiOmy@cluster0.ff5uvt3.mongodb.net/hashbnb?retryWrites=true&w=majority&appName=Cluster0",
} = process.env;

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Deu certo ao conectar com o banco!");
  } catch (error) {
    console.log("NÃO deu certo ao conectar com o banco!", error);
  }
};

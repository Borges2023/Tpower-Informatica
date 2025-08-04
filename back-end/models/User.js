import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

export default model("User", userSchema);

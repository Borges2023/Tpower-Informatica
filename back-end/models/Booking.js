import mongoose, { Schema, model } from "mongoose";

const BookingSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
  checkIn: Date,
  checkOut: Date,
  price: Number,
  guests: Number,
});

export default model("Booking", BookingSchema);

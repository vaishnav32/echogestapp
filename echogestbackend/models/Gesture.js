import mongoose from "mongoose";

const gestureSchema = new mongoose.Schema(
  {
    controllerId: String,
    gesture: String,
    confidence: Number,
    timestamp: Date,
    source: String,
  },
  { timestamps: true }
);

export default mongoose.model("Gesture", gestureSchema);

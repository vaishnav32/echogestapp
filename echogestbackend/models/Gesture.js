import mongoose from "mongoose";

const gestureSchema = new mongoose.Schema(
  {
    controllerId: {
      type: String,
      required: true,
    },
    gesture: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      default: null,
    },
    source: {
      type: String,
      default: "unknown",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gesture", gestureSchema);


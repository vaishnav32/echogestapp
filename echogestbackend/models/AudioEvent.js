import mongoose from "mongoose";

const audioEventSchema = new mongoose.Schema(
  {
    controllerId: {
      type: String,
      required: true,
    },
    sound: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String, // e.g. "mic-array"
    },
  },
  { timestamps: true }
);

export default mongoose.model("AudioEvent", audioEventSchema);

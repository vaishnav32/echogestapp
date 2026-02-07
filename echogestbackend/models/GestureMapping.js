import mongoose from "mongoose";

const gestureMappingSchema = new mongoose.Schema(
  {
    controllerId: {
      type: String,
      required: true,
    },

    gesture: {
      type: String,
      required: true,
    },

    deviceId: {
      type: String, // ESP32 ID
      required: true,
    },

    appliance: {
      type: String,
      required: true,
    },

    action: {
      type: String, // ON / OFF
      enum: ["ON", "OFF"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "GestureMapping",
  gestureMappingSchema
);

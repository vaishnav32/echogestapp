import mongoose from "mongoose";

const deviceCommandSchema = new mongoose.Schema(
  {
    controllerId: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    appliance: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    executed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeviceCommand", deviceCommandSchema);



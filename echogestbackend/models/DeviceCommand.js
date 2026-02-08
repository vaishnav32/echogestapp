import mongoose from "mongoose";

const deviceCommandSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("DeviceCommand", deviceCommandSchema);


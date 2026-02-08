import mongoose from "mongoose";

router.post("/ack", async (req, res) => {
  try {
    const { commandId } = req.body;

    if (!commandId) {
      return res.status(400).json({
        message: "commandId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commandId)) {
      return res.status(400).json({
        message: "Invalid commandId format",
      });
    }

    const command = await DeviceCommand.findById(commandId);

    if (!command) {
      return res.status(404).json({
        message: "Command not found",
      });
    }

    command.executed = true;
    command.executedAt = new Date();
    await command.save();

    res.json({
      message: "Command acknowledged successfully",
    });
  } catch (error) {
    console.error("ACK ERROR:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});






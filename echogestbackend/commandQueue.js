// Simple in-memory queue (demo-safe)
const commandQueue = new Map();
// key = deviceId, value = { appliance, action }

export function addCommand(deviceId, command) {
  commandQueue.set(deviceId, command);
}

export function getCommand(deviceId) {
  const cmd = commandQueue.get(deviceId) || null;
  if (cmd) commandQueue.delete(deviceId); // consume once
  return cmd;
}

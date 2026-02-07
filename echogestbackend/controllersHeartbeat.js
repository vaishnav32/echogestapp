// controllersHeartbeat.js

const controllers = new Map();

const OFFLINE_AFTER_MS = 60 * 1000; // 1 minute

// Called by wearable (Raspberry Pi)
export function updateHeartbeat(controllerId, battery = null) {
  controllers.set(controllerId, {
    controllerId,
    battery,
    lastSeen: new Date(),
  });
}







// Used by GET /api/controllers
export function getControllers() {
  const now = Date.now();

  return Array.from(controllers.values()).map((ctrl) => {
    const isOffline =
      now - new Date(ctrl.lastSeen).getTime() > OFFLINE_AFTER_MS;

    return {
      controllerId: ctrl.controllerId,
      battery: ctrl.battery,
      status: isOffline ? "offline" : "online",
      lastSeen: ctrl.lastSeen,
    };
  });
}

// Called when a controller is deleted
export function removeHeartbeat(controllerId) {
  controllers.delete(controllerId);
}


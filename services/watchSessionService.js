import WatchSession from "../models/WatchSession.js";

// The player heartbeats every 30s; a device that's been silent this long
// (tab closed, phone locked, connection lost) no longer holds the account.
export const WATCH_STALE_MS = 75 * 1000;

const isValidDeviceId = (id) => typeof id === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(id);

export const OTHER_DEVICE = {
  code: "OTHER_DEVICE",
  message: "This account is already playing a video on another device. Only one device can watch at a time."
};

// Claims the account's playback slot for this device.
// Returns { ok: true } or { ok: false, status, body }.
// takeover=true lets the student move playback here (the other device's
// next heartbeat is then refused and its player stops).
export const claimWatchSlot = async ({ userId, deviceId, courseId, lessonId, takeover = false }) => {
  if (!isValidDeviceId(deviceId)) {
    return { ok: false, status: 400, body: { message: "Please refresh the page and try again.", code: "NO_DEVICE" } };
  }

  const now = new Date();
  const session = await WatchSession.findOne({ user: userId });
  const otherActive =
    session &&
    session.deviceId !== deviceId &&
    now - session.lastSeen < WATCH_STALE_MS;

  if (otherActive && !takeover) {
    return { ok: false, status: 409, body: OTHER_DEVICE };
  }

  await WatchSession.updateOne(
    { user: userId },
    { deviceId, course: courseId, lesson: lessonId, lastSeen: now },
    { upsert: true }
  );
  return { ok: true };
};

// Keeps this device's slot alive. Refused (409) once another device has
// taken over, which is the signal for this player to stop.
export const heartbeatWatchSlot = async ({ userId, deviceId }) => {
  if (!isValidDeviceId(deviceId)) {
    return { ok: false, status: 400, body: { message: "Missing device id", code: "NO_DEVICE" } };
  }

  const now = new Date();
  const session = await WatchSession.findOne({ user: userId });

  if (session && session.deviceId !== deviceId) {
    if (now - session.lastSeen < WATCH_STALE_MS) {
      return { ok: false, status: 409, body: OTHER_DEVICE };
    }
    // The other device went quiet — this one may carry on.
  }

  await WatchSession.updateOne(
    { user: userId },
    { deviceId, lastSeen: now },
    { upsert: true }
  );
  return { ok: true };
};

// Frees the slot immediately when the player closes, so switching to
// another device doesn't have to wait for the session to go stale.
export const releaseWatchSlot = async ({ userId, deviceId }) => {
  if (!isValidDeviceId(deviceId)) return;
  await WatchSession.deleteOne({ user: userId, deviceId });
};

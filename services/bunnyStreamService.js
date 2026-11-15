import axios from "axios";
import crypto from "crypto";

// Bunny Stream (video hosting) for course lessons.
//
// Env (Render):
//   BUNNY_STREAM_LIBRARY_ID  — Stream → your library → API → "Video Library ID"
//   BUNNY_STREAM_API_KEY     — same page, "API Key" (server-only, never sent to the browser)
//   BUNNY_STREAM_TOKEN_KEY   — library → Security → "Token Authentication Key"
//                              (turn on "Embed view token authentication" too)
//
// Video files never pass through our server: the admin's browser uploads
// straight to Bunny over TUS using a short-lived signature we issue here.
const API = "https://video.bunnycdn.com";

const libraryId = () => process.env.BUNNY_STREAM_LIBRARY_ID;
const apiKey = () => process.env.BUNNY_STREAM_API_KEY;

export const isBunnyConfigured = () => Boolean(libraryId() && apiKey());

const headers = () => ({ AccessKey: apiKey(), "Content-Type": "application/json" });

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

export const createVideo = async (title) => {
  const res = await axios.post(`${API}/library/${libraryId()}/videos`, { title }, { headers: headers() });
  return res.data; // { guid, ... }
};

export const getVideo = async (videoId) => {
  const res = await axios.get(`${API}/library/${libraryId()}/videos/${encodeURIComponent(videoId)}`, { headers: headers() });
  return res.data; // { status, length, encodeProgress, ... }
};

export const deleteVideo = async (videoId) => {
  await axios.delete(`${API}/library/${libraryId()}/videos/${encodeURIComponent(videoId)}`, { headers: headers() });
};

// Bunny status codes: 0 created, 1 uploaded, 2 processing, 3 transcoding,
// 4 finished, 5 error, 6 upload failed.
export const mapBunnyStatus = (status) => {
  if (status === 4) return "ready";
  if (status === 5 || status === 6) return "failed";
  if (status === 0) return "awaiting_upload";
  return "processing";
};

// Credentials for a direct browser → Bunny TUS upload of ONE video.
// Signature = sha256(libraryId + apiKey + expiration + videoId), per Bunny's docs.
export const createTusUploadCredentials = (videoId, ttlSeconds = 6 * 60 * 60) => {
  const expire = Math.floor(Date.now() / 1000) + ttlSeconds;
  return {
    endpoint: `${API}/tusupload`,
    libraryId: libraryId(),
    videoId,
    expire,
    signature: sha256(`${libraryId()}${apiKey()}${expire}${videoId}`)
  };
};

// Signed, expiring embed URL for the player iframe. A copied link stops
// working after `ttlSeconds`. Token = sha256(tokenKey + videoId + expires).
export const createSignedEmbedUrl = (videoId, ttlSeconds = 4 * 60 * 60) => {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const params = new URLSearchParams({ autoplay: "false", preload: "true", responsive: "true" });

  const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
  if (tokenKey) {
    params.set("token", sha256(`${tokenKey}${videoId}${expires}`));
    params.set("expires", String(expires));
  }

  return {
    url: `https://iframe.mediadelivery.net/embed/${libraryId()}/${videoId}?${params}`,
    expiresAt: new Date(expires * 1000)
  };
};

import cloudinary from "../config/cloudinary.js";

// uploadMiddleware.js (multer memoryStorage) hands controllers an
// in-memory buffer, not a file path — cloudinary's SDK needs a stream to
// upload from a buffer, hence the small Promise wrapper here rather than
// the simpler `cloudinary.uploader.upload(path)` used for on-disk files.
export const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

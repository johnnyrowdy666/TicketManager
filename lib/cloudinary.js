const cloudinary = require('cloudinary').v2;

const cloudUrl = process.env.CLOUDINARY_URL;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let isConfigured = false;
if (cloudUrl) {
  // ใช้ CLOUDINARY_URL ซึ่งมีรูปแบบ cloudinary://<api_key>:<api_secret>@<cloud_name>
  cloudinary.config({ secure: true });
  isConfigured = true;
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  isConfigured = true;
}

function uploadBuffer(buffer, { folder = 'events', filename = 'upload' } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, use_filename: true, unique_filename: true, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function deleteImage(publicId) {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, isConfigured, uploadBuffer, deleteImage };
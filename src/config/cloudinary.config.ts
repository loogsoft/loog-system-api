import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  throw new Error('Variável cloudName não encotrada!');
}
if (!apiKey) {
  throw new Error('Variável apiKey não encotrada!');
}
if (!apiSecret) {
  throw new Error('Variável apiSecret não encotrada!');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;

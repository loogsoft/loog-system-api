import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (process.env.NODE_ENV === 'production') {
  console.log('Validando Cloudinary...');

  if (!cloudName) {
    throw new Error('Variável CLOUDINARY_CLOUD_NAME não encontrada!');
  }

  if (!apiKey) {
    throw new Error('Variável CLOUDINARY_API_KEY não encontrada!');
  }

  if (!apiSecret) {
    throw new Error('Variável CLOUDINARY_API_SECRET não encontrada!');
  }
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;

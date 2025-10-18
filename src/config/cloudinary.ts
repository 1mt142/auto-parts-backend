import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';
import { logger } from '../utils/logger';

cloudinary.config({
  cloud_name: env.cloudinaryName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'auto_parts',
        resource_type: 'auto',
        public_id: `${Date.now()}-${fileName.replace(/\s+/g, '_')}`,
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('No URL returned from Cloudinary'));
        }
      }
    );

    uploadStream.on('error', (error) => {
      logger.error('Upload stream error:', error);
      reject(error);
    });

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl) return;

    const parts = imageUrl.split('/');
    const fileWithExtension = parts[parts.length - 1];
    const fileName = fileWithExtension.split('.')[0];

    if (!fileName) {
      logger.warn('Could not extract filename from URL:', imageUrl);
      return;
    }

    const publicId = `auto_parts/${fileName}`;
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      logger.info(`Deleted from Cloudinary: ${publicId}`);
    } else if (result.result === 'not found') {
      logger.warn(`File not found on Cloudinary: ${publicId}`);
    } else {
      logger.error(`Failed to delete from Cloudinary:`, result);
    }
  } catch (error) {
    logger.error('Error deleting from Cloudinary:', error);
  }
};

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import multer from 'multer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
}).single('file');

const uploadToS3 = async file => {
  return new Promise(async (resolve, reject) => {
    var base64data = Buffer.from(file.buffer, 'binary');
    const randomBytes = crypto.randomBytes(8);
    const fileName = randomBytes.toString('hex') + '.png';
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: base64data,
      ContentType: 'image/png',
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      const uploadedFileURL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`;
      console.log(`File uploaded successfully. ${uploadedFileURL}`);
      resolve({ success: true, url: uploadedFileURL });
    } catch (err) {
      console.log('Error uploading file:', err);
      reject({ success: false });
    }
  });
};

const deleteFromS3 = async key => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    try {
      await s3Client.send(new DeleteObjectCommand(params));
      console.log(`File deleted successfully. ${key}`);
      resolve({ success: true });
    } catch (err) {
      console.log('Error deleting file:', err);
      reject({ success: false });
    }
  });
};

export {
  s3Client as s3,
  uploadMultiple as upload,
  uploadSingle,
  uploadToS3,
  deleteFromS3,
};

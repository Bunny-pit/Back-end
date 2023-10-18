import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const awsUpload = multer({
  storage: multerS3({
    client: s3Client,
    bucket: 'bevelog-bucket',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        Math.floor(Math.random() * 1000).toString() +
          Date.now() +
          '.' +
          file.originalname.split('.').pop(),
      );
    },
  }),
});

export { awsUpload };

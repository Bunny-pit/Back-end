import AWS from 'aws-sdk';
import multer from 'multer'
import dotenv from "dotenv";
import crypto from 'crypto';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
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
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") { // You can add or remove more formats
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
}).single('file');  // 'image' is the field name in the form

const uploadToS3 = (file) => {
  return new Promise((resolve, reject) => {
    var base64data = Buffer.from(file.buffer, 'binary');
    const randomBytes = crypto.randomBytes(8);
    const fileName = randomBytes.toString('hex') + '.png';
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: base64data,
      ContentType: "image/png"
    };
    
    s3.upload(params, (err, data) => {
      if (err) {
          console.log("err : ", err)
          reject({success: false});
      } else {
          console.log("data : ", data)
          console.log(`File uploaded successfully. ${data.Location}`);
          resolve({success: true, url: data.Location});
      }
    });
  });
};

export {
  s3,
  uploadMultiple as upload,
  uploadSingle,
  uploadToS3,
};

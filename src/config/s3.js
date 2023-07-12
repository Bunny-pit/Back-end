import AWS from 'aws-sdk';
import dotenv from "dotenv";
dotenv.config();

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_REGION',
});

// 이미지를 S3에 업로드하는 함수
export const uploadToS3 = async (file) => {
  const params = {
    Bucket: 'YOUR_BUCKET_NAME',
    Key: file.originalname,
    Body: file.buffer,
    ACL: 'public-read',
  };

  try {
    const response = await s3.upload(params).promise();
    return response.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image to S3');
  }
};

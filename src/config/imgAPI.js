//imgAPI.ts
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

// aws config 파일 읽기
aws.config.loadFromPath('s3.json');

// s3 객체 생성
const s3 = new aws.S3();

// multer 에 대한 설정값
const awsUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bevelog-bucket', // 객체를 업로드할 버킷 이름
    acl: 'public-read', // Access control for the file
    key: function (req, file, cb) { // 객체의 키로 고유한 식별자 이기 때문에 겹치면 안됨
      cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
    }
  }),
});
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Set the region and credentials
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
});

const s3 = new AWS.S3();

// Set up Multer and MulterS3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'YOUR_BUCKET_NAME',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

module.exports = upload;
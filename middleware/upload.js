// storage.js
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');

const mongoURI = process.env.DB;

// Initialize database connection
const connection = mongoose.createConnection(mongoURI);

// Initialize GridFS storage
let upload;

connection.once('open', () => {
  console.log('MongoDB connected');

  const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return {
        filename: "mene_market_" + file.originalname + `_${Date.now}`,
      };
    },
  });

  upload = multer({ storage });
});

// Export `upload` as a promise, ensuring it's initialized after the connection is open
const getUploadMiddleware = async () => {
  return new Promise((resolve, reject) => {
    connection.once('open', () => {
      if (!upload) {
        reject(new Error('Failed to initialize GridFS storage'));
      } else {
        resolve(upload);
      }
    });

    connection.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = getUploadMiddleware;

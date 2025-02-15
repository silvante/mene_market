const multer = require("multer");
const storage = multer.memoryStorage(); // Storing files in memory (for buffer access)
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = upload;

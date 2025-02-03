const multer = require("multer");
const storage = multer.memoryStorage(); // Storing files in memory (for buffer access)
const upload = multer({ storage });

module.exports = upload
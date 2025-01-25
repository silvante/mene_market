const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const storage = new GridFsStorage({
    url: process.env.DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photo",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
});

// Log successful connection
storage.on("connection", (db) => {
    console.log("Connected to MongoDB successfully!");
});

// Handle connection errors
storage.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
});

module.exports = multer({ storage });

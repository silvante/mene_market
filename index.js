require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const csurf = require("csurf");
const cors = require("cors");
const app = express();

// limitter

const limitter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// defend

app.use(limitter);
app.use(helmet());
app.use(csurf());

// cors

const allowedOrigins = [process.env.ORIGIN1, process.env.ORIGIN1];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    })
)

let gfs;
connection();
app.use(express.json())

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

app.use("/file", upload);

// media routes
app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

app.delete("/file/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});

// requiring routes
const { router } = require("./routes/extra")
const user = require("./routes/user")
const product = require("./routes/product")
const category = require("./routes/category")
const oqim = require("./routes/oqim")
const order = require("./routes/order")
const dbox = require("./routes/donatebox")
const donate = require("./routes/donate");
const news = require("./routes/news.js");

// using routes
app.use("/", router)
app.use("/users", user)
app.use("/products", product)
app.use("/categorys", category)
app.use("/oqim", oqim)
app.use("/orders", order)
app.use("/dbox", dbox)
app.use("/order", donate)
app.use("/news", news)

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

app.get("/", async (req, res) =>{
    res.status(200).json("backend for mene-market uz # written in node js # written by mardonbek khamidov")
})
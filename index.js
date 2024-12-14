require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const app = express();

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
const router = require("./routes/extra")
const user = require("./routes/user")
const product = require("./routes/product")
const category = require("./routes/category")
const oqim = require("./routes/oqim")
const order = require("./routes/order")

// using routes
app.use("/", router)
app.use("/users", user)
app.use("/products", product)
app.use("/categorys", category)
app.use("/oqim", oqim)
app.use("/orders", order)

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

app.get("/", async (req, res) =>{
    res.status(200).json("backend for mene-market uz # written in node js # written by mardonbek khamidov")
})
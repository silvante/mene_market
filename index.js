require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
// const csurf = require("csurf");
const cors = require("cors");
const app = express();

// for swagger

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation of mene market',
      version: '1.0.0',
      description: 'specially for mene market in 2024 and 2025'
    },
    servers: [
      {
        url: process.env.ORIGIN2
      }
    ]
  },
  apis: ['./routes/*.js', "index.js"] // Path to API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// limitter

const limitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// defend

app.use(limitter);
app.use(helmet());
// app.use(csurf());

// cors

const allowedOrigins = [process.env.ORIGIN1, process.env.ORIGIN2, process.env.ORIGIN3];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

let gfs;
connection();
app.use(express.json());

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
const { router } = require("./routes/extra");
const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const oqim = require("./routes/oqim");
const order = require("./routes/order");
const dbox = require("./routes/donatebox");
const donate = require("./routes/donate");
const news = require("./routes/news.js");
const blog = require("./routes/blog.js");
const comp = require("./routes/comp.js");
const Category = require("./models/category.model.js");
const Product = require("./models/product.model.js");

// using routes
app.use("/", router);
app.use("/api/users", user);
app.use("/api/products", product);
app.use("/api/categorys", category);
app.use("/api/oqim", oqim);
app.use("/api/orders", order);
app.use("/api/dbox", dbox);
app.use("/api/donate", donate);
app.use("/api/news", news);
app.use("/api/blogs", blog);
app.use("/api/competitions", comp);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

app.get("/", async (req, res) => {
  try {
    const categories = Category.find()

    const results = await Promise.all(
      categories.map(async (c) => {
        const products = await Product.find({
          tags: c.title
        }).limit(20).exec()
        return {category: c, products: products}
      })
    )

    res.status(200).send(results)
  } catch (err) {
    console.log(err);
    res.send(err)
  }
});

// Swagger documentation for User routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: All categories with 20 products max
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 */
// just experiment

// now we have only
// sellers
// admins
// owner
// delivery
// operator

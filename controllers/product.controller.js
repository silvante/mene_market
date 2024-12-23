const Product = require("../models/product.model");
const { jwtSecret } = require("../routes/extra");
const jwt = require("jsonwebtoken");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      res.status(404).send("we have no products yet...");
    }
    return res.status(200).send(products);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const addProduct = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin") {
          try {
            const { title, desc, images, tags, price, for_seller, total } =
              req.body;
            const new_product = await Product.create({
              title,
              desc,
              images,
              tags,
              price,
              for_seller,
              total,
            });
            if (!new_product) {
              res.status(404).json({ message: "something went wrong!" });
            }
            res.status(200).json(new_product);
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const editProduct = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin") {
          try {
            const id = req.params.id;
            const { title, desc, images, tags, price, for_seller, total } =
              req.body;
            await Product.findByIdAndUpdate(id, {
              title,
              desc,
              images,
              tags,
              price,
              for_seller,
              total,
            }).then((up_pr) => {
              if (!up_pr) {
                res.status(404).json({ message: "something went wrong!" });
              }
              res.status(200).json({ message: "edited!" });
            });
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const auth_headers = req.headers.authorization;
    if (auth_headers && auth_headers.startsWith("Bearer ")) {
      const token = auth_headers.split("Bearer ")[1];

      jwt.verify(token, jwtSecret, {}, async (err, user_doc) => {
        if (err) {
          throw err;
        }

        if (user_doc.status == "admin") {
          try {
            const id = req.params.id;
            await Product.findByIdAndDelete(id).then((deleted) =>
              deleted
                ? res.status(200).json({ message: "deleted!" })
                : res.status(404).json({ message: "something went wrong!" })
            );
          } catch (err) {
            console.log(err);
            res.send(err);
          }
        } else {
          res
            .status(404)
            .send("bu metoddan foidalanish uchun admin bolishingiz kerak");
        }
      });
    } else {
      res.status(404).send("no token provided");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
};

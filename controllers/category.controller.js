const Category = require("../models/category.model");
const { jwtSecret } = require("../routes/extra");
const jwt = require("jsonwebtoken");

const getCategorys = async (req, res) => {
  try {
    const Categorys = await Category.find();
    if (!Categorys) {
      res.status(404).send("we have no Categorys yet...");
    }
    return res.status(200).send(Categorys);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getCategory = async (req, res) => {
  try {
    const Category = await Category.findById(req.params.id);

    if (!Category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(Category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const addCategory = async (req, res) => {
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
            const { title } = req.body;
            const new_Category = await Category.create({
              title,
            });
            if (!new_Category) {
              res.status(404).json({ message: "something went wrong!" });
            }
            res.status(200).json(new_Category);
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

const editCategory = async (req, res) => {
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
            const { title } = req.body;
            Category.findByIdAndUpdate(id, {
              title,
            }).then((up_ct) => {
              if (!up_ct) {
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

const deleteCategory = async (req, res) => {
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
            await Category.findByIdAndDelete(id).then((deleted) =>
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
  getCategorys,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
};

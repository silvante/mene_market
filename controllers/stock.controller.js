const Stock = require("../models/stock.model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../routes/extra");

const createStock = async (req, res) => {
  try {
    const stocks = req.body.stocks; // Expecting an array of stock objects
    if (!Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({ error: "Invalid input format" });
    }

    const many_stocks = await Stock.insertMany(stocks);
    const ids = many_stocks((stock) => stock._id);

    return res.status(200).json({
      ids: ids,
      stocks: many_stocks,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const deleteStock = async (req, res) => {
  try {
    const stock_id = req.params.id; // Expecting an array of stock objects
    const deleted_stock = await Stock.findByIdAndDelete(stock_id);

    if (!deleted_stock) {
      return res.status(400).json({ message: "something went wrong" });
    }

    return res.status(200).json({ message: "stock deleted" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = { createStock, deleteStock };

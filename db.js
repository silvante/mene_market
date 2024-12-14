const mongoose = require("mongoose");

module.exports = async function connection() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("connected to database");
    } catch (error) {
        console.log(error);
        console.log("could not connect to database");
    }
};

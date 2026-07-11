const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    image: String,
    reason: String,
    condition: String,
    details: String
});

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
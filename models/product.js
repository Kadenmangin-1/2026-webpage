const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: Number,
    description: String,
    category: String,
    unit: String,
    price: Number,
    color: String,
    image: String
});

module.exports = mongoose.model("Product", productSchema);
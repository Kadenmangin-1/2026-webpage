const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: String,
    description: String,
    price: Number,
    quantity: Number
});

module.exports = mongoose.model("CartItem", cartItemSchema);
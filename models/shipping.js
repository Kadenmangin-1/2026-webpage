const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
    fullName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    deliveryMethod: String
});

module.exports = mongoose.model("Shipping", shippingSchema);
const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
    fullName: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    paymentMethod: {
        cardNumber: String,
        expiration: String,
        cvv: String
    },
    shipping: String,
    item: String,
    quantity: Number,
    basePrice: Number,
    shippingCost: Number,
    totalAmount: Number
});

module.exports = mongoose.model("Billing", billingSchema);
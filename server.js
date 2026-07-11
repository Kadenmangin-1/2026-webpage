const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

console.log("USING UPDATED SERVER FILE");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

mongoose.connect("mongodb+srv://kcm5666:Kenzie308!@cluster0.pxfsjt5.mongodb.net/psu_storefront?retryWrites=true&w=majority&appName=Cluster0", {
    serverSelectionTimeoutMS: 30000
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

const productSchema = new mongoose.Schema({
    productId: { type: Number, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true }
});

const shopperSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    age: { type: Number, required: true },
    address: { type: String, required: true }
});

const shoppingCartSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" }
});

const shippingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    deliveryMethod: { type: String, required: true }
});

const billingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    paymentMethod: {
        cardNumber: { type: String, required: true },
        expiration: { type: String, required: true },
        cvv: { type: String, required: true }
    },
    shipping: { type: String, required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
});

const returnSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    reason: { type: String, required: true },
    condition: { type: String, required: true },
    details: { type: String, default: "" }
});

const Product = mongoose.model("Product", productSchema);
const Shopper = mongoose.model("Shopper", shopperSchema);
const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);
const Shipping = mongoose.model("Shipping", shippingSchema);
const Billing = mongoose.model("Billing", billingSchema);
const ReturnRequest = mongoose.model("ReturnRequest", returnSchema);

console.log("Seed route loaded");

app.get("/seed-products", async (req, res) => {
    try {
        await Product.deleteMany({});

        await Product.insertMany([
            {
                productId: 1,
                description: "Penn State Football Jersey",
                category: "Clothing",
                unit: "Each",
                price: 89.99,
                color: "Blue",
                image: "https://dks.scene7.com/is/image/GolfGalaxy/24NIKMNCPSNVYNKRPPEN?wid=2000&hei=2000&fmt=pjpeg"
            },
            {
                productId: 2,
                description: "PSU Baseball Cap",
                category: "Accessories",
                unit: "Each",
                price: 24.99,
                color: "White",
                image: "https://dks.scene7.com/is/image/GolfGalaxy/2147BMNCPSNVYCLNPPEN?wid=2000&hei=2000&fmt=pjpeg"
            },
            {
                productId: 3,
                description: "Nittany Lions Hoodie",
                category: "Clothing",
                unit: "Each",
                price: 59.99,
                color: "Gray",
                image: "https://dks.scene7.com/is/image/GolfGalaxy/24CLMMNCPSNVYPRM2PENB?wid=2000&hei=2000&fmt=pjpeg"
            },
            {
                productId: 4,
                description: "Penn State Mug",
                category: "Home",
                unit: "Each",
                price: 14.99,
                color: "Blue",
                image: "https://dks.scene7.com/is/image/GolfGalaxy/24TMEUNCPS15ZSCLPPEN?wid=2000&hei=2000&fmt=pjpeg"
            }
        ]);

        res.send("Products seeded successfully.");
    } catch (error) {
        console.error("Seed error:", error);
        res.status(500).send("Error seeding products.");
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ productId: 1 });
        res.json(products);
    } catch (error) {
        console.error("PRODUCTS ROUTE ERROR:", error);
        res.status(500).json({
            message: "Error loading products",
            error: error.message
        });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json({
            message: "Product saved successfully",
            data: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving product", error: error.message });
    }
});

app.put("/api/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product deleted successfully",
            data: deletedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

app.post("/shopper", async (req, res) => {
    try {
        const shopper = new Shopper(req.body);
        await shopper.save();
        res.json({
            message: "Shopper saved successfully",
            data: shopper
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving shopper", error: error.message });
    }
});

app.get("/shopper", async (req, res) => {
    try {
        const shoppers = await Shopper.find();
        res.json(shoppers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading shoppers", error: error.message });
    }
});

app.put("/shopper/:id", async (req, res) => {
    try {
        const updatedShopper = await Shopper.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedShopper) {
            return res.status(404).json({ message: "Shopper not found" });
        }

        res.json({
            message: "Shopper updated successfully",
            data: updatedShopper
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating shopper", error: error.message });
    }
});

app.delete("/shopper/:id", async (req, res) => {
    try {
        const deletedShopper = await Shopper.findByIdAndDelete(req.params.id);

        if (!deletedShopper) {
            return res.status(404).json({ message: "Shopper not found" });
        }

        res.json({
            message: "Shopper deleted successfully",
            data: deletedShopper
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting shopper", error: error.message });
    }
});

app.post("/cart", async (req, res) => {
    try {
        const cartItem = new ShoppingCart(req.body);
        await cartItem.save();
        res.json({
            message: "Cart item saved successfully",
            data: cartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving cart item", error: error.message });
    }
});

app.get("/cart", async (req, res) => {
    try {
        const cartItems = await ShoppingCart.find();
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading cart", error: error.message });
    }
});

app.put("/cart/:id", async (req, res) => {
    try {
        const updatedCartItem = await ShoppingCart.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.json({
            message: "Cart item updated successfully",
            data: updatedCartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating cart item", error: error.message });
    }
});

app.delete("/cart/:id", async (req, res) => {
    try {
        const deletedCartItem = await ShoppingCart.findByIdAndDelete(req.params.id);

        if (!deletedCartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.json({
            message: "Cart item deleted successfully",
            data: deletedCartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting cart item", error: error.message });
    }
});

app.post("/shipping", async (req, res) => {
    try {
        const shipping = new Shipping(req.body);
        await shipping.save();
        res.json({
            message: "Shipping saved successfully",
            data: shipping
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving shipping", error: error.message });
    }
});

app.get("/shipping", async (req, res) => {
    try {
        const data = await Shipping.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading shipping", error: error.message });
    }
});

app.post("/billing", async (req, res) => {
    try {
        const billing = new Billing(req.body);
        await billing.save();
        res.json({
            message: "Billing saved successfully",
            data: billing
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving billing", error: error.message });
    }
});

app.get("/billing", async (req, res) => {
    try {
        const data = await Billing.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading billing", error: error.message });
    }
});

app.post("/returns", async (req, res) => {
    try {
        const returnRequest = new ReturnRequest(req.body);
        await returnRequest.save();
        res.json({
            message: "Return saved successfully",
            data: returnRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving return", error: error.message });
    }
});

app.get("/returns", async (req, res) => {
    try {
        const data = await ReturnRequest.find();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error loading returns", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
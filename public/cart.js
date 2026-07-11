let products = [];
let cart = [];

async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.log("Could not load products:", error);
    }
}

function displayProducts(list) {
    let container = $("#productList");
    container.empty();

    list.forEach(p => {
        container.append(`
            <div class="col-md-3">
                <div class="card p-2 mb-3">
                    <img src="${p.image}" alt="${p.description}" class="img-fluid mb-2">
                    <h5>${p.description}</h5>
                    <p>$${p.price}</p>
                    <button class="btn btn-primary" onclick="addToCart(${p.productId}, '${String(p.description).replace(/'/g, "\\'")}', ${p.price}, '${String(p.image || '').replace(/'/g, "\\'")}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `);
    });
}

$("#searchProduct").on("keyup", function () {
    let value = $(this).val().toLowerCase();

    let filtered = products.filter(p =>
        p.description.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value)
    );

    displayProducts(filtered);
});

async function addToCart(id, description, price, image) {
    const existing = cart.find(item => item.productId === id);

    if (existing) {
        existing.quantity += 1;
        try {
            await fetch(`/cart/${existing._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(existing)
            });
        } catch (error) {
            console.log("Could not update cart item:", error);
        }
    } else {
        const newItem = {
            productId: id,
            description: description,
            price: price,
            quantity: 1,
            image: image
        };

        try {
            const response = await fetch("/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });

            const result = await response.json();

            if (response.ok) {
                cart.push(result.data);
            } else {
                alert(result.message || "Could not add to cart.");
            }
        } catch (error) {
            console.log("Could not save cart item:", error);
        }
    }

    updateCart();
}

async function removeFromCart(index) {
    try {
        const item = cart[index];

        const response = await fetch(`/cart/${item._id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Could not remove cart item.");
            return;
        }

        cart.splice(index, 1);
        updateCart();
    } catch (error) {
        console.log("Could not remove cart item:", error);
    }
}

async function loadCart() {
    try {
        const response = await fetch("/cart");
        cart = await response.json();
        updateCart();
    } catch (error) {
        console.log("Could not load cart:", error);
    }
}

function updateCart() {
    let list = $("#cartList");
    list.empty();

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        list.append(`
            <li class="list-group-item d-flex justify-content-between">
                ${item.description} - $${item.price} (Qty: ${item.quantity})
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">X</button>
            </li>
        `);
    });

    $("#totalPrice").text(total.toFixed(2));
    $("#cartJSON").text(JSON.stringify(cart, null, 2));
}

$(document).ready(function () {
    loadProducts();
    loadCart();
});
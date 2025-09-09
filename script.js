const cart = [];
const cartList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

const productIds = ["NHN3U5BQL8UEG", "V9ZBN4H4U9X9E"];
const shop = document.getElementById("shop");

// Load product info from backend (which calls PayPal)
async function loadProduct(id) {
  const res = await fetch(`http://localhost:3000/product/${id}`);
  return await res.json();
}

async function initShop() {
  for (const id of productIds) {
    const product = await loadProduct(id);

    // PayPal product API doesn’t always include price directly.
    // If you also create catalog items (not just products), you can fetch pricing from /v2/catalogs/items.
    const price = product.price?.value || "0.00";

    const div = document.createElement("div");
    div.className = "item";
    div.dataset.id = id;
    div.dataset.name = product.name || `Product ${id}`;
    div.dataset.price = price;

    div.innerHTML = `
      <h3>${product.name || "Unknown Item"}</h3>
      <p>$${price}</p>
    `;

    div.addEventListener("click", () => addToCart(div));
    shop.appendChild(div);
  }
}

function addToCart(item) {
  const id = item.dataset.id;
  const name = item.dataset.name;
  const price = parseFloat(item.dataset.price);

  const existing = cart.find(product => product.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(product => {
    total += product.price * product.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.name} x${product.qty} - $${(product.price * product.qty).toFixed(2)}
      <button onclick="removeFromCart('${product.id}')">❌</button>
    `;
    cartList.appendChild(li);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(id) {
  const index = cart.findIndex(product => product.id === id);
  if (index > -1) {
    if (cart[index].qty > 1) {
      cart[index].qty--;
    } else {
      cart.splice(index, 1);
    }
  }
  renderCart();
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  // Build PayPal checkout URL
  let url = `https://www.paypal.com/cgi-bin/webscr?cmd=_cart&business=X7DSDTCNVDRK8&upload=1`;

  cart.forEach((product, i) => {
    const index = i + 1;
    url += `&item_name_${index}=${encodeURIComponent(product.name)}`;
    url += `&amount_${index}=${product.price}`;
    url += `&quantity_${index}=${product.qty}`;
    url += `&item_number_${index}=${product.id}`;
  });

  window.location.href = url;
});

// Init shop on page load
initShop();

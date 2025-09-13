const cart = [];
const cartList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// Currency formatter for MXN
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value);
};

// Add merch items to cart
document.querySelectorAll(".item:not(.fanservice)").forEach(item => {
  item.addEventListener("click", () => {
    addToCart(item.dataset.id, item.dataset.name, parseFloat(item.dataset.price));
  });
});

// Fanservice modal logic
const fanserviceBtn = document.querySelector(".fanservice");
const modal = document.getElementById("fanservice-modal");
const closeBtn = modal.querySelector(".close-btn");

fanserviceBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Add fanservice options
document.querySelectorAll(".option").forEach(option => {
  option.addEventListener("click", () => {
    addToCart(option.dataset.id, option.dataset.name, parseFloat(option.dataset.price));
    modal.style.display = "none";
  });
});

// Add to cart function
function addToCart(id, name, price) {
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
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-details">${formatCurrency(product.price)} x ${product.qty} = ${formatCurrency(product.price * product.qty)}</div>
      </div>
      <button class="remove-btn" onclick="removeFromCart('${product.id}')">
        <img src="images/trashicon.svg" alt="Remove">
      </button>
    `;
    cartList.appendChild(li);
  });

  cartTotal.textContent = `Total: ${formatCurrency(total)}`;
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

  let url = `https://www.paypal.com/cgi-bin/webscr?cmd=_cart&business=X7DSDTCNVDRK8&upload=1&currency_code=MXN`;

  cart.forEach((product, i) => {
    const index = i + 1;
    url += `&item_name_${index}=${encodeURIComponent(product.name)}`;
    url += `&amount_${index}=${product.price}`;
    url += `&quantity_${index}=${product.qty}`;
    url += `&item_number_${index}=${product.id}`;
  });

  window.location.href = url;
});

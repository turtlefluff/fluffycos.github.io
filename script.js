async function loadProduct(id) {
    const res = await fetch(`/product/${id}`);
    return await res.json();
  }
  
  async function initShop() {
    const productIds = ["NHN3U5BQL8UEG", "V9ZBN4H4U9X9E"];
    const shop = document.querySelector(".shop");
  
    for (const id of productIds) {
      const product = await loadProduct(id);
      const div = document.createElement("div");
      div.className = "item";
      div.dataset.id = id;
      div.dataset.name = product.name;
      div.dataset.price = product.price?.value || "0.00";
  
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>$${product.price?.value || "N/A"}</p>
      `;
      shop.appendChild(div);
    }
  }
  
  initShop();
  
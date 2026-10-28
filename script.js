const products = [
  { id: 1, name: "iPhone 15", brand: "Apple", detail: "128 GB · Midnight", price: 699, icon: "📱" },
  { id: 2, name: "Galaxy S24", brand: "Samsung", detail: "256 GB · Graphite", price: 749, icon: "📲" },
  { id: 3, name: "Redmi Note 13", brand: "Xiaomi", detail: "256 GB · Ocean Teal", price: 229, icon: "📱" },
  { id: 4, name: "iPhone 14", brand: "Apple", detail: "128 GB · Blue", price: 549, icon: "📱" },
  { id: 5, name: "Galaxy A55", brand: "Samsung", detail: "128 GB · Awesome Navy", price: 379, icon: "📲" },
  { id: 6, name: "Xiaomi 14", brand: "Xiaomi", detail: "512 GB · Black", price: 799, icon: "📱" },
  { id: 7, name: "iPhone SE", brand: "Apple", detail: "64 GB · Starlight", price: 299, icon: "📱" },
  { id: 8, name: "Galaxy A15", brand: "Samsung", detail: "128 GB · Blue Black", price: 179, icon: "📲" }
];

let activeBrand = "All";
let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");

function money(value) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const matchesBrand = activeBrand === "All" || product.brand === activeBrand;
    const matchesSearch = `${product.name} ${product.brand} ${product.detail}`.toLowerCase().includes(query);
    return matchesBrand && matchesSearch;
  });

  if (!filtered.length) {
    productGrid.innerHTML = '<p class="empty-state">No phones found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-visual" aria-hidden="true">${product.icon}</div>
      <h3>${product.name}</h3>
      <p class="product-meta">${product.brand} · ${product.detail}</p>
      <div class="product-bottom">
        <span class="price">${money(product.price)}</span>
        <button class="add-button" data-add="${product.id}">＋ Add</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = cart.length;

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-row">
        <div><strong>${item.name}</strong><small>${money(item.price)}</small></div>
        <button class="remove-button" data-remove="${index}">Remove</button>
      </div>
    `).join("");
  }
  document.getElementById("cartTotal").textContent = money(total);
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find(item => item.id === Number(button.dataset.add));
  if (product) cart.push(product);
  renderCart();
  button.textContent = "✓ Added";
  setTimeout(() => { button.textContent = "＋ Add"; }, 900);
});

document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  cart.splice(Number(button.dataset.remove), 1);
  renderCart();
});

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-brand]");
  if (!button) return;
  activeBrand = button.dataset.brand;
  document.querySelectorAll(".filter").forEach(filter => filter.classList.toggle("active", filter === button));
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
document.getElementById("cartButton").addEventListener("click", () => cartDialog.showModal());
document.getElementById("closeCart").addEventListener("click", () => cartDialog.close());
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();

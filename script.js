// Define the currency symbol here
const currencySymbol = "$"; // Change to "₹" or any symbol you want

function formatCurrency(amount) {
  return `${currencySymbol}${amount}`;
}

const products = [
  { id: 1, name: "White  pant ", price: 1200, img: "assets/product-1.jpg" },
  { id: 2, name: "Tie-Dye Lounge Set", price: 1000, img: "assets/product-2.jpg" },
  { id: 3, name: "sun burst track suit", price: 1500, img: "assets/product-3.jpg" },
  { id: 4, name: "urban sportwear combo", price: 1300, img: "assets/product-4.jpg" },
  { id: 5, name: "over sized knit & coat", price: 1100, img: "assets/product-5.jpg" },
  { id: 6, name: "chic monchrome blazer", price: 1050, img: "assets/product-6.jpg" }
];

const productGrid = document.getElementById("productGrid");
const bundleList = document.getElementById("bundleList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const discountText = document.getElementById("discountText");
const subtotalText = document.getElementById("subtotalText");
const addToCart = document.getElementById("addToCart");

let selected = [];

function updateSidebar() {
  bundleList.innerHTML = "";
  let subtotal = 0;

  for (let i = 0; i < selected.length; i++) {
    const item = selected[i];

    const li = document.createElement("li");
    const wrapper = document.createElement("div");
    wrapper.className = "sidebar-item";

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    const content = document.createElement("div");
    content.className = "bundle-content";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = item.name;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = formatCurrency(item.price);

    const controls = document.createElement("div");
    controls.className = "bottom";

    const qty = document.createElement("div");
    qty.className = "qty";

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
        updateSidebar();
      }
    };

    const count = document.createElement("span");
    count.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = () => {
      item.quantity++;
      updateSidebar();
    };

    qty.appendChild(minus);
    qty.appendChild(count);
    qty.appendChild(plus);

    const remove = document.createElement("button");
    remove.className = "remove";
    remove.textContent = "🗑️";
    remove.onclick = () => {
      const idx = selected.findIndex(s => s.id === item.id);
      if (idx !== -1) {
        selected.splice(idx, 1);
        updateSidebar();
        const card = document.querySelector(`.product-card[data-id="${item.id}"]`);
        if (card) {
          const btn = card.querySelector("button");
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Add to Bundle";
            btn.classList.remove("added");
          }
        }
        if (selected.length < 3) {
          document.querySelectorAll(".product-card").forEach(c => {
            const id = Number(c.dataset.id);
            const b = c.querySelector("button");
            if (b && !selected.find(s => s.id === id)) {
              b.disabled = false;
              b.textContent = "Add to Bundle";
              b.classList.remove("added");
            }
          });
        }
      }
    };

    controls.appendChild(qty);
    controls.appendChild(remove);

    content.appendChild(name);
    content.appendChild(price);
    content.appendChild(controls);

    wrapper.appendChild(img);
    wrapper.appendChild(content);
    li.appendChild(wrapper);
    bundleList.appendChild(li);

    subtotal += item.price * item.quantity;
  }

  const discount = selected.length === 3 ? Math.floor(subtotal * 0.3) : 0;
  discountText.textContent = formatCurrency(discount);
  subtotalText.textContent = formatCurrency(subtotal - discount);
  progressBar.style.width = `${(selected.length / 3) * 100}%`;
  progressText.textContent = `${selected.length}/3 added`;
  addToCart.disabled = selected.length !== 3;

  if (selected.length >= 3) {
    document.querySelectorAll(".product-card button:not(.added)").forEach(btn => (btn.disabled = true));
  }
}

products.forEach(p => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.id = p.id;
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}" />
    <h5>${p.name}</h5>
    <p>${formatCurrency(p.price)}</p>
    <button>Add to Bundle</button>
  `;
  const btn = card.querySelector("button");
  btn.addEventListener("click", () => {
    const already = selected.find(item => item.id === p.id);
    if (!already && selected.length < 3) {
      selected.push({ ...p, quantity: 1 });
      btn.textContent = "✔ Item Added";
      btn.classList.add("added");
      btn.disabled = true;
      updateSidebar();
    }
  });

  productGrid.appendChild(card);
});

addToCart.addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.className = "bundle-overlay";

  const modal = document.createElement("div");
  modal.className = "bundle-modal";

  const header = document.createElement("div");
  header.className = "modal-header";
  header.innerHTML = `<h3>Your Bundle</h3><button class="modal-close">✕</button>`;
  header.querySelector(".modal-close").onclick = () => overlay.remove();

  const body = document.createElement("div");
  body.className = "modal-body";

  if (selected.length === 0) {
    body.innerHTML = `<p>No items in bundle.</p>`;
  } else {
    const ul = document.createElement("ul");
    ul.className = "modal-list";

    let subtotal = 0;
    selected.forEach(item => {
      subtotal += item.price * item.quantity;
      ul.innerHTML += `
        <li>
          <img src="${item.img}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong>
            <span>Qty: ${item.quantity}</span>
          </div>
          <div class="price">${formatCurrency(item.price * item.quantity)}</div>
        </li>`;
    });

    const discount = selected.length === 3 ? Math.floor(subtotal * 0.3) : 0;
    const total = subtotal - discount;

    body.appendChild(ul);
    body.innerHTML += `
      <div class="modal-summary">
        <p>Subtotal: ${formatCurrency(subtotal)}</p>
        <p>Discount: ${formatCurrency(discount)}</p>
        <p><strong>Total: ${formatCurrency(total)}</strong></p>
      </div>`;
  }

  const footer = document.createElement("div");
  footer.className = "modal-footer";
  footer.innerHTML = `<button class="modal-continue">Continue</button>`;
  footer.querySelector(".modal-continue").onclick = () => overlay.remove();

  modal.append(header, body, footer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
});

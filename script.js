// Order data (in-memory array)
let order = [];

const orderList = document.getElementById("orderList");
const subtotalSpan = document.getElementById("subtotal");
const totalSpan = document.getElementById("total");

const VISITS_KEY = "loyalty_visits";

// Loyalty helper functions
function getLoyaltyData() {
  return JSON.parse(localStorage.getItem(VISITS_KEY) || "{}");
}

function saveLoyaltyData(data) {
  localStorage.setItem(VISITS_KEY, JSON.stringify(data));
}

function addVisit(customer) {
  const data = getLoyaltyData();
  customer = customer.trim().toLowerCase();
  if (!customer) return 0;
  data[customer] = (data[customer] || 0) + 1;
  saveLoyaltyData(data);
  return data[customer];
}

function getVisits(customer) {
  const data = getLoyaltyData();
  customer = customer.trim().toLowerCase();
  return data[customer] || 0;
}

function isFreeMeal(visits) {
  const FREE_MEAL_EVERY = 5;
  return visits > 0 && visits % FREE_MEAL_EVERY === 0;
}

// Add loyalty message div below customer input ONCE here
const customerInput = document.getElementById("customerName");
const loyaltyMessageDiv = document.createElement("div");
loyaltyMessageDiv.style.marginTop = "10px";
loyaltyMessageDiv.style.fontWeight = "bold";
loyaltyMessageDiv.style.color = "#c82333";
customerInput.parentNode.appendChild(loyaltyMessageDiv);

// Track original total for loyalty calculation
let originalTotal = 0;

// Listen for category buttons and item card filtering (your existing code)
const categoryButtons = document.querySelectorAll(".category");
const itemCards = document.querySelectorAll(".item-card");

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const selectedCategory = btn.textContent.trim();

    itemCards.forEach(card => {
      const itemCategory = card.getAttribute("data-category");
      card.style.display = (selectedCategory === "All" || selectedCategory === itemCategory) ? "block" : "none";
    });
  });
});

// Add to order buttons (your existing code)
document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", e => {
    const card = e.target.closest(".item-card");
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price) || 0;
    const image = card.dataset.image;

    const existingItem = order.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      order.push({ name, price, quantity: 1, image });
    }

    updateOrderList();
  });
});

// Update order summary and show loyalty info
function updateOrderList() {
  orderList.innerHTML = '';
  let subtotal = 0;

  order.forEach(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - $${lineTotal.toFixed(2)}`;
    orderList.appendChild(li);
  });

  originalTotal = subtotal;

  // Show total or override if free meal active
  if (!loyaltyMessageDiv.textContent.includes("FREE MEAL")) {
    totalSpan.textContent = subtotal.toFixed(2);
  }
}

// Loyalty check and total update on customer input
customerInput.addEventListener("input", () => {
  const customerName = customerInput.value.trim();
  if (!customerName) {
    loyaltyMessageDiv.textContent = "";
    totalSpan.textContent = originalTotal.toFixed(2);
    return;
  }

  const visits = getVisits(customerName);

  if (isFreeMeal(visits)) {
    loyaltyMessageDiv.textContent = "🎉 FREE MEAL AVAILABLE!";
    totalSpan.textContent = "0.00"; // Override total for free meal
  } else {
    const FREE_MEAL_EVERY = 5;
    const left = FREE_MEAL_EVERY - (visits % FREE_MEAL_EVERY);
    loyaltyMessageDiv.textContent = `${customerName} has ${visits} visits. ${left} more until a free meal.`;
    totalSpan.textContent = originalTotal.toFixed(2);
  }
});

// Submit order - save locally and update loyalty
document.getElementById("submitOrder").addEventListener("click", () => {
  const employee = document.getElementById("employeeName").value;
  const customer = document.getElementById("customerName").value.trim();

  if (!employee || !customer) {
    alert("Please enter both employee and customer names.");
    return;
  }

  if (order.length === 0) {
    alert("Please add items to your order before submitting.");
    return;
  }

  const visits = getVisits(customer);
  const freeMeal = isFreeMeal(visits);
  const total = freeMeal ? 0 : order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderData = {
    employee,
    customer,
    items: order,
    total,
    timestamp: new Date().toISOString(),
    done: false,
    freeMeal
  };

  // Save order locally
  const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
  existingOrders.push(orderData);
  localStorage.setItem("orders", JSON.stringify(existingOrders));

  alert(`Order saved!${freeMeal ? " (Free meal applied)" : ""}`);

  // Add visit only if NOT free meal
  if (!freeMeal) {
    addVisit(customer);
  }

  // Clear order and inputs
  order = [];
  updateOrderList();
  customerInput.value = "";
  document.getElementById("employeeName").value = "";
  loyaltyMessageDiv.textContent = "";
});

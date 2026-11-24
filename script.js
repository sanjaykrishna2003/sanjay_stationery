const PRODUCTS = {
  pen: {
    id: 'pen',
    name: 'Pen',
    pricePaise: 2000,
  },
  notebook: {
    id: 'notebook',
    name: 'Notebook',
    pricePaise: 6000,
  },
};

const MIN_QTY = 1;
const MAX_QTY = 99;

const inrFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Store prices and totals in whole paise so addition and multiplication stay exact.
let cartItems = [];
let isOrderPlaced = false;

const cartItemsEl = document.getElementById('cart-items');
const emptyCartEl = document.getElementById('empty-cart');
const cartMessageEl = document.getElementById('cart-message');
const orderTotalEl = document.getElementById('order-total');
const checkoutForm = document.getElementById('checkout-form');
const customerNameInput = document.getElementById('customer-name');
const nameErrorEl = document.getElementById('name-error');
const placeOrderBtn = document.getElementById('place-order-btn');
const mainLayout = document.getElementById('main-layout');
const confirmationContainer = document.getElementById('confirmation-container');
const addButtons = document.querySelectorAll('[data-add-id]');

function formatRupees(paise) {
  return '\u20B9' + inrFormatter.format(paise / 100);
}

function calculateOrderTotal() {
  let totalPaise = 0;
  for (const item of cartItems) {
    totalPaise += item.pricePaise * item.quantity;
  }
  return totalPaise;
}

function updateOrderTotal() {
  const orderTotal = calculateOrderTotal();
  orderTotalEl.textContent = formatRupees(orderTotal);
}

function showCartMessage(message) {
  cartMessageEl.textContent = message;
  cartMessageEl.hidden = false;
}

function clearCartMessage() {
  cartMessageEl.textContent = '';
  cartMessageEl.hidden = true;
}

function showNameError(message) {
  nameErrorEl.textContent = message;
  nameErrorEl.hidden = false;
  customerNameInput.setAttribute('aria-invalid', 'true');
}

function clearNameError() {
  nameErrorEl.textContent = '';
  nameErrorEl.hidden = true;
  customerNameInput.removeAttribute('aria-invalid');
}

function setControlsDisabled(disabled) {
  customerNameInput.disabled = disabled;
  for (const btn of addButtons) {
    btn.disabled = disabled;
  }
  const cartControls = cartItemsEl.querySelectorAll('button, input');
  for (const control of cartControls) {
    control.disabled = disabled;
  }
}

function addToCart(productId) {
  if (isOrderPlaced) {
    return;
  }

  const product = PRODUCTS[productId];
  if (!product) {
    return;
  }

  const existing = cartItems.find((item) => item.id === productId);
  if (existing) {
    if (existing.quantity >= MAX_QTY) {
      showCartMessage('Maximum quantity per item is 99.');
      return;
    }
    existing.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      pricePaise: product.pricePaise,
      quantity: 1,
    });
  }

  clearCartMessage();
  renderCart();
}

function removeFromCart(productId) {
  if (isOrderPlaced) {
    return;
  }

  cartItems = cartItems.filter((item) => item.id !== productId);
  clearCartMessage();
  renderCart();
}

function stepQuantity(productId, delta) {
  if (isOrderPlaced) {
    return;
  }

  const item = cartItems.find((entry) => entry.id === productId);
  if (!item) {
    return;
  }

  const nextQty = item.quantity + delta;
  if (nextQty < MIN_QTY) {
    showCartMessage('Minimum quantity is 1. Use Remove to take an item out of the cart.');
    return;
  }
  if (nextQty > MAX_QTY) {
    showCartMessage('Maximum quantity per item is 99.');
    return;
  }

  item.quantity = nextQty;
  clearCartMessage();
  renderCart();
}

function handleQuantityInput(item, inputEl, lineTotalEl) {
  if (isOrderPlaced) {
    return;
  }

  const raw = inputEl.value.trim();
  if (raw === '') {
    return;
  }

  if (!/^\d+$/.test(raw)) {
    inputEl.value = String(item.quantity);
    showCartMessage('Please enter a whole number between 1 and 99.');
    return;
  }

  const parsed = Number(raw);
  if (parsed < MIN_QTY) {
    item.quantity = MIN_QTY;
    inputEl.value = String(MIN_QTY);
    showCartMessage('Minimum quantity is 1. Use Remove to take an item out of the cart.');
  } else if (parsed > MAX_QTY) {
    item.quantity = MAX_QTY;
    inputEl.value = String(MAX_QTY);
    showCartMessage('Maximum quantity per item is 99.');
  } else {
    item.quantity = parsed;
    clearCartMessage();
  }

  lineTotalEl.textContent = formatRupees(item.pricePaise * item.quantity);
  updateOrderTotal();
}

function handleQuantityBlur(item, inputEl, lineTotalEl) {
  if (isOrderPlaced) {
    return;
  }

  if (inputEl.value.trim() === '') {
    item.quantity = MIN_QTY;
    inputEl.value = String(MIN_QTY);
    lineTotalEl.textContent = formatRupees(item.pricePaise * item.quantity);
    updateOrderTotal();
    showCartMessage('Quantity cannot be empty. Reset to 1.');
  }
}

function createCartItemElement(item) {
  const li = document.createElement('li');
  li.className = 'cart-item';
  li.dataset.testid = 'cart-item-' + item.id;

  const topRow = document.createElement('div');
  topRow.className = 'cart-item-top';

  const nameSpan = document.createElement('span');
  nameSpan.className = 'cart-item-name';
  nameSpan.textContent = item.name;

  const unitSpan = document.createElement('span');
  unitSpan.className = 'cart-item-unit';
  unitSpan.textContent = formatRupees(item.pricePaise) + ' each';

  topRow.appendChild(nameSpan);
  topRow.appendChild(unitSpan);

  const controlsRow = document.createElement('div');
  controlsRow.className = 'cart-item-controls';

  const qtyGroup = document.createElement('div');
  qtyGroup.className = 'qty-group';

  const minusBtn = document.createElement('button');
  minusBtn.type = 'button';
  minusBtn.className = 'qty-btn';
  minusBtn.textContent = '-';
  minusBtn.setAttribute('aria-label', 'Decrease quantity for ' + item.name);
  minusBtn.dataset.testid = 'decrease-' + item.id;
  minusBtn.addEventListener('click', () => stepQuantity(item.id, -1));

  const qtyLabel = document.createElement('label');
  qtyLabel.className = 'visually-hidden';
  qtyLabel.htmlFor = 'qty-' + item.id;
  qtyLabel.textContent = 'Quantity for ' + item.name;

  const qtyInput = document.createElement('input');
  qtyInput.type = 'text';
  qtyInput.inputMode = 'numeric';
  qtyInput.id = 'qty-' + item.id;
  qtyInput.className = 'qty-input';
  qtyInput.value = String(item.quantity);
  qtyInput.dataset.testid = 'qty-' + item.id;

  const plusBtn = document.createElement('button');
  plusBtn.type = 'button';
  plusBtn.className = 'qty-btn';
  plusBtn.textContent = '+';
  plusBtn.setAttribute('aria-label', 'Increase quantity for ' + item.name);
  plusBtn.dataset.testid = 'increase-' + item.id;
  plusBtn.addEventListener('click', () => stepQuantity(item.id, 1));

  const lineTotalSpan = document.createElement('span');
  lineTotalSpan.className = 'line-total';
  lineTotalSpan.dataset.testid = 'line-total-' + item.id;
  lineTotalSpan.textContent = formatRupees(item.pricePaise * item.quantity);

  qtyInput.addEventListener('input', () => handleQuantityInput(item, qtyInput, lineTotalSpan));
  qtyInput.addEventListener('blur', () => handleQuantityBlur(item, qtyInput, lineTotalSpan));

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-btn';
  removeBtn.dataset.testid = 'remove-' + item.id;
  removeBtn.appendChild(document.createTextNode('Remove '));
  const removeHidden = document.createElement('span');
  removeHidden.className = 'visually-hidden';
  removeHidden.textContent = item.name;
  removeBtn.appendChild(removeHidden);
  removeBtn.addEventListener('click', () => removeFromCart(item.id));

  qtyGroup.appendChild(minusBtn);
  qtyGroup.appendChild(qtyLabel);
  qtyGroup.appendChild(qtyInput);
  qtyGroup.appendChild(plusBtn);

  controlsRow.appendChild(qtyGroup);
  controlsRow.appendChild(removeBtn);
  controlsRow.appendChild(lineTotalSpan);

  li.appendChild(topRow);
  li.appendChild(controlsRow);

  return li;
}

function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cartItems.length === 0) {
    emptyCartEl.hidden = false;
  } else {
    emptyCartEl.hidden = true;
    for (const item of cartItems) {
      cartItemsEl.appendChild(createCartItemElement(item));
    }
  }

  updateOrderTotal();
}

function generateOrderRef() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return 'SS-' + num;
}

function showConfirmation(customerName, totalPaise, orderRef) {
  confirmationContainer.innerHTML = '';
  mainLayout.classList.add('has-confirmation');

  const section = document.createElement('section');
  section.className = 'confirmation';
  section.setAttribute('aria-labelledby', 'confirmation-heading');
  section.dataset.testid = 'order-confirmation';

  const heading = document.createElement('h3');
  heading.id = 'confirmation-heading';
  heading.textContent = 'Order Confirmed';

  const message = document.createElement('p');
  message.appendChild(document.createTextNode('Thank you, '));
  const nameStrong = document.createElement('strong');
  nameStrong.dataset.testid = 'confirm-name';
  nameStrong.textContent = customerName;
  message.appendChild(nameStrong);
  message.appendChild(document.createTextNode('. Your order has been placed.'));

  const details = document.createElement('dl');
  details.className = 'confirmation-details';

  const refRow = document.createElement('div');
  const refTerm = document.createElement('dt');
  refTerm.textContent = 'Order Reference';
  const refVal = document.createElement('dd');
  refVal.dataset.testid = 'confirm-ref';
  refVal.textContent = orderRef;
  refRow.appendChild(refTerm);
  refRow.appendChild(refVal);

  const totalRow = document.createElement('div');
  const totalTerm = document.createElement('dt');
  totalTerm.textContent = 'Order Total';
  const totalVal = document.createElement('dd');
  totalVal.dataset.testid = 'confirm-total';
  totalVal.textContent = formatRupees(totalPaise);
  totalRow.appendChild(totalTerm);
  totalRow.appendChild(totalVal);

  details.appendChild(refRow);
  details.appendChild(totalRow);

  const newOrderBtn = document.createElement('button');
  newOrderBtn.type = 'button';
  newOrderBtn.className = 'btn-secondary';
  newOrderBtn.dataset.testid = 'place-another-order';
  newOrderBtn.textContent = 'Place another order';
  newOrderBtn.addEventListener('click', resetOrder);

  section.appendChild(heading);
  section.appendChild(message);
  section.appendChild(details);
  section.appendChild(newOrderBtn);

  confirmationContainer.appendChild(section);
}

function resetOrder() {
  cartItems = [];
  isOrderPlaced = false;
  customerNameInput.value = '';
  clearNameError();
  clearCartMessage();
  confirmationContainer.innerHTML = '';
  mainLayout.classList.remove('has-confirmation');
  placeOrderBtn.disabled = false;
  setControlsDisabled(false);
  renderCart();
}

function handlePlaceOrder() {
  // Ignore extra submits if an order was already confirmed (double-click or double Enter).
  if (isOrderPlaced) {
    return;
  }

  if (cartItems.length === 0) {
    showCartMessage('Your cart is empty. Please add at least one item.');
    return;
  }

  const trimmedName = customerNameInput.value.trim();
  if (trimmedName === '') {
    showNameError('Please enter your name to place the order.');
    customerNameInput.focus();
    return;
  }

  isOrderPlaced = true;
  placeOrderBtn.disabled = true;
  clearNameError();
  clearCartMessage();
  setControlsDisabled(true);

  const orderTotal = calculateOrderTotal();
  const orderRef = generateOrderRef();
  showConfirmation(trimmedName, orderTotal, orderRef);
}

for (const btn of addButtons) {
  btn.addEventListener('click', () => {
    addToCart(btn.dataset.addId);
  });
}

customerNameInput.addEventListener('input', () => {
  if (customerNameInput.value.trim() !== '') {
    clearNameError();
  }
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handlePlaceOrder();
});

renderCart();

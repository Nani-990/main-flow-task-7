let products = [];

function addProduct() {
  const name = prompt("Enter Product Name:");
  const qty = parseInt(prompt("Enter Quantity:"), 10);
  const price = parseFloat(prompt("Enter Unit Price:"));

  if (name && qty > 0 && price > 0) {
    const total = qty * price;
    products.push({ name, qty, price, total });
    renderProducts();
  } else {
    alert("Please enter valid product details.");
  }
}

function renderProducts() {
  const tbody = document.getElementById("productBody");
  tbody.innerHTML = "";
  let subtotal = 0;

  products.forEach((p) => {
    subtotal += p.total;
    tbody.innerHTML += `<tr>
      <td>${p.name}</td>
      <td>${p.qty}</td>
      <td>${p.price.toFixed(2)}</td>
      <td>${p.total.toFixed(2)}</td>
    </tr>`;
  });

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("total").innerText = subtotal.toFixed(2);
}

function previewBill() {
  const buyer = {
    name: document.getElementById("buyerName").value,
    address: document.getElementById("buyerAddress").value,
    contact: document.getElementById("buyerContact").value,
    email: document.getElementById("buyerEmail").value,
  };
  const transactionId = document.getElementById("transactionId").value;
  const date = document.getElementById("purchaseDate").value;
  const paymentMethod = document.getElementById("paymentMethod").value;
  const totalAmount = document.getElementById("total").innerText;

  let html = `<div class="preview-container">
    <h2>Bill Preview</h2>
    <h3>Buyer: ${buyer.name}</h3>
    <p>${buyer.address}, ${buyer.contact}, ${buyer.email}</p>

    <table>
      <thead>
        <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
      </thead>
      <tbody>`;

  products.forEach((p) => {
    html += `<tr><td>${p.name}</td><td>${p.qty}</td><td>${p.price.toFixed(2)}</td><td>${p.total.toFixed(2)}</td></tr>`;
  });

  html += `</tbody></table>
    <p><strong>Subtotal:</strong> ₹${document.getElementById("subtotal").innerText}</p>
    <p><strong>Total:</strong> ₹${totalAmount}</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
    <p class="paid-note">Payment of ₹${totalAmount} received via ${paymentMethod}.</p>
    <p class="thank-you">Thanks for purchasing. Please visit again!</p>
  </div>`;

  document.getElementById("billPreview").innerHTML = html;
}

function printBill() {
  const content = document.getElementById("billPreview").innerHTML;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<html><head><title>Print Bill</title></head><body>');
  win.document.write(content);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}

function downloadPDF() {
  const element = document.getElementById("billPreview");
  if (!element.innerHTML.trim()) {
    alert("Please preview the bill before downloading.");
    return;
  }

  const opt = {
    margin: 0.5,
    filename: `bill_${document.getElementById("transactionId").value || "transaction"}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
}

function saveBill() {
  const id = document.getElementById("transactionId").value;
  if (!id) {
    alert("Enter a transaction ID to save.");
    return;
  }

  const data = {
    buyerName: document.getElementById("buyerName").value,
    buyerAddress: document.getElementById("buyerAddress").value,
    buyerContact: document.getElementById("buyerContact").value,
    buyerEmail: document.getElementById("buyerEmail").value,
    products,
    subtotal: document.getElementById("subtotal").innerText,
    total: document.getElementById("total").innerText,
    date: document.getElementById("purchaseDate").value,
    payment: document.getElementById("paymentMethod").value,
  };

  localStorage.setItem(id, JSON.stringify(data));
  alert("Bill saved successfully!");
}

function searchBill() {
  const id = document.getElementById("searchInput").value.trim();
  const resultDiv = document.getElementById("searchResults");
  resultDiv.innerHTML = "";

  const data = localStorage.getItem(id);
  if (data) {
    const bill = JSON.parse(data);
    resultDiv.innerHTML = `
      <p><strong>Buyer:</strong> ${bill.buyerName}</p>
      <p><strong>Total:</strong> ₹${bill.total}</p>
      <p><strong>Date:</strong> ${bill.date}</p>
      <p><strong>Payment:</strong> ${bill.payment}</p>
    `;
  } else {
    resultDiv.innerHTML = "<p>No bill found with this Transaction ID.</p>";
  }
}

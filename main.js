let items = [];
let projects = [];
let currentProjectIndex = null;


function addItem() {
  const date = document.getElementById("purchaseDate").value.trim();
  const name = document.getElementById("itemName").value.trim();
  const quantity = parseFloat(document.getElementById("itemQuantity").value);
  const totalCost = parseFloat(document.getElementById("itemTotalCost").value);
  const weight = parseFloat(document.getElementById("itemWeight").value);

  if (!date || !name || isNaN(quantity) || isNaN(totalCost) || isNaN(weight) || weight === 0) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const unitCost = totalCost / weight;
  const total = quantity * unitCost;
  items.push({ date, name, quantity, totalCost, weight });
  updateTable();
  clearInputs();
}

function updateTable() {
    const tableBody = document.querySelector("#itemTable tbody");
    tableBody.innerHTML = "";
  
    let projectTotal = 0;
  
    items.forEach((item, index) => {
      const unitCost = item.totalCost / item.weight;
      const total = unitCost * item.quantity;
      item.unitCost = unitCost;
      item.total = total;
  
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${item.date}</td>
        <td contenteditable oninput="editItem(${index}, 'name', this.innerText)">${item.name}</td>
        <td contenteditable oninput="editItem(${index}, 'quantity', this.innerText)">${item.quantity}</td>
        <td contenteditable oninput="editItem(${index}, 'totalCost', this.innerText)">$${item.totalCost.toFixed(2)}</td>
        <td contenteditable oninput="editItem(${index}, 'weight', this.innerText)">${item.weight}</td>
        <td>$${unitCost.toFixed(2)}</td>
        <td>$${total.toFixed(2)}</td>
      `;
  
      tableBody.appendChild(row);
      projectTotal += total;
    });
  
    document.getElementById("projectTotal").textContent = projectTotal.toFixed(2);
  }
  
  function editItem(index, field, value) {
    value = value.replace(/[^0-9.\-]/g, ""); // Remove unwanted chars like "$"
    const number = parseFloat(value);
  
    if (field === 'quantity' || field === 'totalCost' || field === 'weight') {
      if (!isNaN(number)) {
        items[index][field] = number;
      }
    } else if (field === 'name') {
      items[index].name = value.trim();
    }
  
    updateTable();
  }
  

function clearInputs() {
  document.getElementById("purchaseDate").value = "";
  document.getElementById("itemName").value = "";
  document.getElementById("itemQuantity").value = "";
  document.getElementById("itemTotalCost").value = "";
  document.getElementById("itemWeight").value = "";
}

function saveProject() {
    const projectName = document.getElementById("projectName").value.trim();
  
    if (!projectName) {
      alert("Enter a project name.");
      return;
    }
  
    // Saving an existing project (even if no new items)
    if (currentProjectIndex !== null) {
      projects[currentProjectIndex].name = projectName;
      projects[currentProjectIndex].items = [...items];
    } else {
      if (items.length === 0) {
        alert("No items to save.");
        return;
      }
      // Saving new project
      projects.push({ name: projectName, items: [...items] });
    }
  
    // Save to localStorage
    saveProjectsToStorage();
  
    items = [];
    currentProjectIndex = null;
    document.getElementById("projectName").value = "";
    updateTable();
    renderProjectCards();
  }
  

function renderProjectCards() {
  const container = document.getElementById("projectCards");
  container.innerHTML = "";

  projects.forEach((project, index) => {
    const total = project.items.reduce((sum, item) => sum + item.total, 0).toFixed(2);

    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.marginBottom = "10px";
    card.style.borderRadius = "8px";
    card.style.backgroundColor = "#f9f9f9";

    card.innerHTML = `
      <h3>${project.name}</h3>
      <p><strong>Items:</strong> ${project.items.length}</p>
      <p><strong>Total Cost:</strong> $${total}</p>
      <button onclick="loadProject(${index})">Load</button>
    <button onclick="deleteProject(${index})" style="margin-left: 10px; color: red;">Delete</button>

    `;

    container.appendChild(card);
  });
}

function loadProject(index) {
    items = [...projects[index].items];
    currentProjectIndex = index;
    updateTable();
    document.getElementById("projectName").value = projects[index].name;
  }
  
  function startNewProject() {
    items = [];
    currentProjectIndex = null;
    document.getElementById("projectName").value = "";
    updateTable();
  }
  function deleteProject(index) {
    const confirmDelete = confirm(`Are you sure you want to delete "${projects[index].name}"?`);
    if (!confirmDelete) return;
  
    projects.splice(index, 1);
  
    // Clear current project if it was deleted
    if (currentProjectIndex === index) {
      items = [];
      currentProjectIndex = null;
      document.getElementById("projectName").value = "";
      updateTable();
    }
  
    saveProjectsToStorage();
    renderProjectCards();
  }
  function saveProjectsToStorage() {
    localStorage.setItem("projectList", JSON.stringify(projects));
  }
  
  function loadProjectsFromStorage() {
    const stored = localStorage.getItem("projectList");
    if (stored) {
      projects = JSON.parse(stored);
      renderProjectCards();
    }
  }
// On first page load
loadProjectsFromStorage();

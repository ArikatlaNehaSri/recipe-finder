// ===== LOGIN/SIGNUP =====
function loginUser(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const storedUser = localStorage.getItem("username");
  const storedPass = localStorage.getItem("password");
  if(username === storedUser && password === storedPass){
    window.location.href = "home.html";
  } else {
    alert("Invalid credentials.");
  }
}

function signupUser(e){
  e.preventDefault();
  const newUser = document.getElementById("newUsername").value;
  const newPass = document.getElementById("newPassword").value;
  localStorage.setItem("username", newUser);
  localStorage.setItem("password", newPass);
  alert("Account created! Please login.");
  showLogin();
}

function showSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
}
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
}

// ===== DASHBOARD =====
const apiKey = "6db2e646ddbb404f8059894611df40e2"; // Replace with your valid API key

const categoryMap = {
  breakfast: "breakfast",
  lunch: "main course",
  dinner: "main course",
  snacks: "appetizer",
  dessert: "dessert",
  beverages: "beverage"
};

// ===== SEARCH BY TITLE =====
async function searchRecipes() {
  const query = document.getElementById("searchInput").value;
  if(!query) return;
  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&apiKey=${apiKey}&addRecipeInformation=true`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    displayRecipes(data.results);
  } catch (err) {
    document.getElementById("results").innerHTML = `<p>${err.message}</p>`;
  }
}

// ===== SEARCH BY INGREDIENTS =====
async function searchByIngredients() {
  const query = document.getElementById("searchInput").value;
  if(!query) return;
  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodeURIComponent(query)}&number=12&apiKey=${apiKey}&addRecipeInformation=true`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    displayRecipes(data.results);
  } catch(err) {
    document.getElementById("results").innerHTML = `<p>${err.message}</p>`;
  }
}

// ===== FETCH CATEGORY =====
async function fetchCategory(category) {
  const type = categoryMap[category] || "main course";
  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?type=${type}&number=12&apiKey=${apiKey}&addRecipeInformation=true`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    displayRecipes(data.results);
  } catch(err) {
    document.getElementById("results").innerHTML = `<p>${err.message}</p>`;
  }
}

// ===== DISPLAY RECIPES =====
function displayRecipes(recipes){
  const results = document.getElementById("results");
  results.innerHTML = "";
  if(!recipes || recipes.length === 0){
    results.innerHTML = "<p>No recipes found.</p>";
    return;
  }
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button onclick="openModal(${recipe.id})">View Recipe</button>
    `;
    results.appendChild(card);
  });
}

// ===== MODAL =====
async function openModal(id){
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  modal.style.display = "block";

  try {
    const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
    if(!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
    const data = await res.json();

    modalBody.innerHTML = `
      <h2>${data.title}</h2>
      <img src="${data.image}" style="width:100%;border-radius:10px;">
      <h3>Ingredients:</h3>
      <ul>${data.extendedIngredients.map(i=>`<li>${i.original}</li>`).join("")}</ul>
      <h3>Instructions:</h3>
      <p>${data.instructions || "No instructions available."}</p>
      <a href="${data.sourceUrl}" target="_blank">Go to full recipe</a>
    `;
  } catch(err) {
    modalBody.innerHTML = `<p>${err.message}</p>`;
  }
}

function closeModal(){
  document.getElementById("modal").style.display = "none";
}

// ===== AUTO SLIDER =====
let sliderIndex = 0;
function autoSlide() {
  const slider = document.getElementById("categorySlider");
  if(!slider) return;
  const slides = slider.querySelectorAll(".slide");
  sliderIndex++;
  if(sliderIndex >= slides.length) sliderIndex = 0;
  slider.style.transform = `translateX(-${sliderIndex * (slides[0].offsetWidth + 16)}px)`;
}
setInterval(autoSlide, 3000);
window.addEventListener('DOMContentLoaded', () => {
  displayDefaultRecipes();
});
function displayDefaultRecipes() {
  const recipes = [
    { title: "Roasted Peppers, Spinach & Feta Pizza", image: "https://img.spoonacular.com/recipes/658615-312x231.jpg" },
    { title: "Rustic Grilled Peaches Pizza", image: "https://img.spoonacular.com/recipes/658920-312x231.jpg" },
    { title: "Pizza bites with pumpkin", image: "https://img.spoonacular.com/recipes/656329-312x231.jpg" },
    { title: "BLT Pizza", image: "https://img.spoonacular.com/recipes/680975-312x231.jpg" },
    { title: "Plantain Pizza", image: "https://img.spoonacular.com/recipes/716300-312x231.jpg" },
    { title: "Zucchini Pizza Boats", image: "https://img.spoonacular.com/recipes/665769-312x231.jpg" },
    { title: "Pepperoni Pizza Muffins", image: "https://img.spoonacular.com/recipes/655698-312x231.jpg" },
    { title: "Easy Cheesy Pizza Casserole", image: "https://img.spoonacular.com/recipes/641893-312x231.jpg" },
    { title: "Paneer & Fig Pizza", image: "https://img.spoonacular.com/recipes/654523-312x231.jpg" },
    { title: "Pesto Veggie Pizza", image: "https://img.spoonacular.com/recipes/655847-312x231.jpg" }
  ];

  displayRecipes(recipes);
}
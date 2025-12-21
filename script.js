// 1. Find the button in the HTML document
const loginButton = document.querySelector('button');

// 2. Define what happens when clicked
function handleLogin() {
    alert("Welcome to Kgaleditsimo AI Tutors!");
    loginButton.innerText = "Logout";
    loginButton.style.backgroundColor = "#e74c3c"; // Change color to Red
}

// 3. Attach the "click" event to the function
loginButton.addEventListener('click', handleLogin);
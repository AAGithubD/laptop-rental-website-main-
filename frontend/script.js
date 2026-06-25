const apiUrl = 'http://127.0.0.1:5000/api';

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

async function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const address = document.getElementById('signup-address').value;

    const response = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, phone, address })
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
        showLoginForm(); // Show login form after successful signup
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${apiUrl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
        sessionStorage.setItem('loggedIn', username); // Store logged-in user in sessionStorage
        window.location.href = 'catalog.html'; // Redirect to catalog page after successful login
    }
}

async function rentLaptop(laptopName) {
    const username = sessionStorage.getItem('loggedIn');
    if (!username) {
        alert('Please login first!');
        return;
    }

    const days = prompt(`How many days do you want to rent the ${laptopName}?`);
    if (!days || isNaN(days) || days <= 0) {
        alert('Invalid number of days.');
        return;
    }

    const response = await fetch('http://127.0.0.1:5000/rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, laptop_name: laptopName, days })
    });

    const result = await response.json();
    alert(result.message);
}

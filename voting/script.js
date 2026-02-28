// Signup Form
const signupForm = document.getElementById('signupForm');
if(signupForm) {
    signupForm.addEventListener('submit', function(e){
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        // Save user to localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if(users.find(u => u.email === email)) {
            alert('Email already registered!');
            return;
        }
        users.push({email, password});
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please login.');
        window.location.href = 'index.html';
    });
}

// Login Form
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user by email OR student_id
    const user = users.find(u =>
      (u.email === identifier || u.student_id === identifier) &&
      u.password === password
    );

    if (user) {
      alert('Login Successful!');

      // Save logged in user
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid Student ID/Email or Password');
    }
  });
}
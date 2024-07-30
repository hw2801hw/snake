// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSPDVNF9jB2Pg8hI0kjj9wIQvitm-RlRc",
  databaseURL: "https://games-99bce-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);

// Get references to the forms
const signinForm = document.getElementById('signin-form');
const registerForm = document.getElementById('register-form');

// Handle password toggle
const passwordInputs = document.querySelectorAll('.password-container input[type="password"]');
const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');

passwordToggleBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const passwordInput = passwordInputs[index];
    const icon = btn.querySelector('i');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
});

// Handle sign-in
signinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  firebase.database().ref('users/' + username).once('value', (snapshot) => {
    if (snapshot.exists() && snapshot.val().password === password) {
      alert(`Hello ${username}!`);
    } else {
      alert('Invalid username or password.');
    }
  });
});

// Handle registration
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newUsername = document.getElementById('new-username').value;
  const newPassword = document.getElementById('new-password').value;

  // Check if the username already exists
  firebase.database().ref('users/' + newUsername).once('value', (snapshot) => {
    if (snapshot.exists()) {
      alert('Username already exists. Please choose a different username.');
    } else {
      firebase.database().ref('users/' + newUsername).set({
        username: newUsername,
        password: newPassword
      }).then(() => {
        alert('Registration successful! Please sign in.');
        showSigninForm();
      }).catch((error) => {
        alert('Error registering user: ' + error.message);
      });
    }
  });
});

// Helper functions
function showRegisterForm() {
  document.getElementById('register-container').style.display = 'block';
  document.getElementById('signin-form').style.display = 'none';
  document.getElementById('pageTitle').textContent = 'Register';
  document.getElementById('register-link').style.display = 'block';
}

function showSigninForm() {
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('signin-form').style.display = 'block';
  document.getElementById('pageTitle').textContent = 'Sign In';
  document.getElementById('register-link').style.display = 'block';
}

// Show the register form by default
showRegisterForm();

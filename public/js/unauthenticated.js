const loginSection = document.getElementById('login');
const loginLink = document.getElementById('login-link');
const signupSection = document.getElementById('sign-up');
const signupLink = document.getElementById('signup-link');

loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.classList.remove('is-hidden');
  signupSection.classList.remove('is-hidden');
  signupSection.classList.add('is-hidden');
});

signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.classList.remove('is-hidden');
  signupSection.classList.remove('is-hidden');
  loginSection.classList.add('is-hidden');
});

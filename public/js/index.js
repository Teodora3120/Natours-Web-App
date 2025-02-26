/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
// DOM ELEMENTS
const mapElement = document.getElementById('map');
const loginForm = document.querySelector('.form');
const signupForm = document.querySelector('#signup-form');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// DELEGATION
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById(
      'signup-passwordConfirm',
    ).value;
    const role = document.getElementById('role').value;
    signup(name, email, password, passwordConfirm, role);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('settings-name').value);
    form.append('email', document.getElementById('settings-email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-new-password').innerHTML =
      'Updating ...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('new-password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-new-password').innerHTML =
      'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

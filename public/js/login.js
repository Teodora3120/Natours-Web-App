/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const url = 'http://127.0.0.1:3000/api/v1/users/login';
    const data = {
      email: email,
      password: password,
    };
    const response = await axios({
      method: 'POST',
      url: url,
      data: data,
    });
    if (response.data.status == 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const url = 'http://127.0.0.1:3000/api/v1/users/logout';
    const response = await axios({
      method: 'GET',
      url: url,
    });
    if (response.data.status == 'success') {
      location.assign('/login');
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

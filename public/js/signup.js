/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm, role) => {
  try {
    const url = 'http://127.0.0.1:3000/api/v1/users/signup';
    const data = {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      role: role,
    };
    const response = await axios({
      method: 'POST',
      url: url,
      data: data,
    });
    if (response.data.status == 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

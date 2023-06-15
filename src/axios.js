// axios.js

import axios from 'axios';

// Create an instance of Axios with custom configuration
const instance = axios.create({
  baseURL: 'http://localhost:5001/api', // Set your API base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors for request and response handling
instance.interceptors.request.use(
  (config) => {
    // Do something before sending the request
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Do something with the response data
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default instance;

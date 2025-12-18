// API Configuration
// For development, use your local machine's IP address
// To find your IP: run `ifconfig` in terminal and look for your local IP (usually starts with 192.168.x.x)

// For iOS Simulator, localhost works
// For Android Emulator, use 10.0.2.2 instead of localhost
// For physical devices, use your computer's local IP address

const DEV_API_URL = 'http://localhost:3000';

// For physical device testing, replace with your machine's IP:
// const DEV_API_URL = 'http://192.168.x.x:3000';

// For Android Emulator:
// const DEV_API_URL = 'http://10.0.2.2:3000';

export const API_URL = DEV_API_URL;

export const API_ENDPOINTS = {
  getMockDrinks: `${API_URL}/get-mock-drinks`,
  getDrink: `${API_URL}/get-drink`,
};

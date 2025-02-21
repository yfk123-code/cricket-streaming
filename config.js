// config.js
const config = {
  API_KEY: import.meta.env.VITE_API_KEY, // Environment variable se API Key
  SHEET_ID: import.meta.env.VITE_SHEET_ID, // Environment variable se Sheet ID
  SHEET_NAME: import.meta.env.VITE_SHEET_NAME || 'Sheet1' // Environment variable se Sheet Name (fallback: 'Sheet1')
};

export default config;

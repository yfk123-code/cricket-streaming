const config = {
  API_KEY: import.meta.env.VITE_API_KEY || 'AIzaSyDuaFrtqW_rU_xTqOE22JyLrBan4OttiAM', // Fallback API Key
  SHEET_ID: import.meta.env.VITE_SHEET_ID || '14p7uHj8Utrg3J4FuOsmQtWWohqnd3uG0-BLViMRR3RA', // Fallback Sheet ID
  SHEET_NAME: 'Sheet1' // Sheet name (isame change nahi karna hai)
};

export default config;

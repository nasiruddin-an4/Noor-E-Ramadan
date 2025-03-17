/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}", // Include the main App file
    "./app/**/*.{js,jsx,ts,tsx}", // Include all files in the app directory
    "./components/**/*.{js,jsx,ts,tsx}", // Include all files in the components directory
  ],
  presets: [require("nativewind/preset")], // Use NativeWind preset
  theme: {
    extend: {}, 
  },
  plugins: [], 
  darkMode: "media", 
};
import React, { createContext, useContext } from 'react';

const theme = {
  colors: {
    primary: '#8B4513', // SaddleBrown
    background: '#fff',
    text: '#000',
    buttonText: '#fff',
    inputBackground: '#f5f5f5',
    border: '#ccc',
  },
};

// ✅ Create a Theme Context
const ThemeContext = createContext();

// ✅ Create a ThemeProvider
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Custom hook to access the theme
export const useTheme = () => {
  return useContext(ThemeContext);
};

export default theme;

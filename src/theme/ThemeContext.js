import React, { createContext, useContext, useState } from 'react';

const lightTheme = {
  dark: false,
  colors: {
    bg: '#F5F4F1',
    surface: '#FFFFFF',
    surface2: '#F0EEE9',
    surface3: '#E8E6E0',
    text: '#1A1917',
    textSecondary: '#5C5B57',
    textTertiary: '#8A8880',
    border: '#D6D4CE',
    borderStrong: '#B8B6B0',
    accent: '#1A5FA8',
    accentLight: '#E4EEF8',
    accentText: '#0D3D6E',
    success: '#2E6B0F',
    successLight: '#E8F3E0',
    successText: '#1E4A0A',
    warning: '#7A4A08',
    warningLight: '#FDF0D8',
    warningText: '#5A3506',
    danger: '#9B2B2B',
    dangerLight: '#FAEAEA',
    dangerText: '#6E1C1C',
    cardShadow: 'rgba(0,0,0,0.06)',
    headerBg: '#FFFFFF',
    tabActive: '#1A5FA8',
    tabInactive: '#8A8880',
  },
};

const darkTheme = {
  dark: true,
  colors: {
    bg: '#131312',
    surface: '#1E1E1C',
    surface2: '#272725',
    surface3: '#303030',
    text: '#F0EEE9',
    textSecondary: '#B0AEA8',
    textTertiary: '#7A7874',
    border: '#3A3A38',
    borderStrong: '#505050',
    accent: '#4A9EE8',
    accentLight: '#0D2A45',
    accentText: '#82BEF0',
    success: '#6BBD2A',
    successLight: '#142808',
    successText: '#A8E070',
    warning: '#E8A030',
    warningLight: '#2A1800',
    warningText: '#F0C070',
    danger: '#E05050',
    dangerLight: '#2A0A0A',
    dangerText: '#F09090',
    cardShadow: 'rgba(0,0,0,0.3)',
    headerBg: '#1E1E1C',
    tabActive: '#4A9EE8',
    tabInactive: '#7A7874',
  },
};

const ThemeContext = createContext({ theme: lightTheme, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(prev => !prev);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

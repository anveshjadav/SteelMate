import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palettes } from './tokens';

const THEME_STORAGE_KEY = '@steelcalc_theme_mode'; // 'light' | 'dark'

const lightTheme = { dark: false, colors: palettes.light };
const darkTheme = { dark: true, colors: palettes.dark };

const ThemeContext = createContext({ theme: lightTheme, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore the persisted mode once, before first paint of content.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (!cancelled && stored === 'dark') setIsDark(true);
      } catch {
        // Storage unavailable — fall back to light mode silently.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light').catch(() => {});
  };

  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, hydrated }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

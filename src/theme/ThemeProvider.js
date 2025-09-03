// src/theme/ThemeProvider.js
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Load from localStorage or default to light
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  // Persist to localStorage + Tailwind's dark mode class
  useEffect(() => {
    localStorage.setItem("theme", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#7b1fa2" },
                secondary: { main: "#ff4081" },
                background: { default: "#f4f6f8", paper: "#ffffff" },
              }
            : {
                primary: { main: "#ab47bc" },
                secondary: { main: "#f48fb1" },
                background: { default: "#121212", paper: "#1e1e1e" },
              }),
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

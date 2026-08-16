import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
  switchable?: boolean;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === "undefined" || !switchable) return defaultTheme;
    const stored = window.localStorage.getItem("theme-preference") || window.localStorage.getItem("theme");
    return stored === "light" || stored === "dark" || stored === "system" ? stored : defaultTheme;
  });
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const theme: Theme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => setSystemTheme(mediaQuery.matches ? "dark" : "light");
    handleSystemThemeChange();
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.themePreference = preference;
    if (switchable) {
      window.localStorage.setItem("theme-preference", preference);
      window.localStorage.setItem("theme", theme);
    }
  }, [preference, theme, switchable]);

  const applyPreference = (nextPreference: ThemePreference) => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.add("theme-transitioning");
      window.setTimeout(() => root.classList.remove("theme-transitioning"), 360);
    }
    setPreference(nextPreference);
  };

  const toggleTheme = switchable
    ? () => applyPreference(theme === "light" ? "dark" : "light")
    : undefined;

  const value = useMemo(
    () => ({ theme, preference, setPreference: applyPreference, toggleTheme, switchable }),
    [theme, preference, toggleTheme, switchable],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

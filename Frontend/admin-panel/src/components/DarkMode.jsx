// src/components/DarkModeToggle.jsx
import { useTheme } from "../context/ThemeContext";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`px-6 py-2 rounded-lg border transition
        ${isDark ? "bg-primary text-white" : "bg-secondary text-primary"}`}
    >
      {isDark ? "Dark Mode: ON" : "Dark Mode: OFF"}
    </button>
  );
}

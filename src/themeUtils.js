export function applyThemeColors(colors) {
  const root = document.documentElement;
  if (!colors) return;
  if (colors.primary) root.style.setProperty("--color-primary", colors.primary);
  if (colors.primaryHover)
    root.style.setProperty("--color-primary-hover", colors.primaryHover);
  if (colors.secondary)
    root.style.setProperty("--color-secondary", colors.secondary);
  if (colors.accent) root.style.setProperty("--color-accent", colors.accent);
}

const THEME_KEY = "forge_theme";

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "dark";
  } catch {
    return "dark";
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function toggleTheme() {
  const current = getStoredTheme();
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

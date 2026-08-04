"use client";

import { useEffect, useState } from "react";

export const THEMES = [
  "night",
  "dark",
  "synthwave",
  "cyberpunk",
  "valentine",
  "winter",
  "cupcake",
  "emerald",
  "forest",
  "luxury",
] as const;

export type ThemeName = (typeof THEMES)[number];

const STORAGE_KEY = "concert-cost-theme";
const DEFAULT_THEME: ThemeName = "night";

export function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeSelector({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    const next = saved && THEMES.includes(saved) ? saved : DEFAULT_THEME;
    setTheme(next);
    applyTheme(next);
  }, []);

  function onChange(next: ThemeName) {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm opacity-80 whitespace-nowrap">Theme</span>
      <select
        className="select select-bordered select-sm w-full max-w-[10rem]"
        value={theme}
        onChange={(e) => onChange(e.target.value as ThemeName)}
        aria-label="Choose app theme"
      >
        {THEMES.map((name) => (
          <option key={name} value={name}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ThemeScript() {
  const code = `
    (function() {
      try {
        var t = localStorage.getItem('${STORAGE_KEY}') || '${DEFAULT_THEME}';
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', '${DEFAULT_THEME}');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

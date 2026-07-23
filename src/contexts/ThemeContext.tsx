import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchSiteSettings, upsertSiteSetting } from '@/services/api';
import { supabase } from '@/db/supabase';

export type Theme = 'dark' | 'light';

export type ThemeSettings = {
  primaryColor: string;
  accentColor: string;
  neonEffect: boolean;
  texture: string;
  backgroundColor: string;
};

export const defaultThemeSettings: ThemeSettings = {
  primaryColor: '#0047b3',
  accentColor: '#1751d0',
  neonEffect: false,
  texture: 'none',
  backgroundColor: '#0a0a0a',
};

interface ThemeContextType {
  themeMode: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Dark/Light Mode ---
  const [themeMode, setThemeMode] = useState<Theme>(() => {
    const stored = localStorage.getItem('itsec_theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark'; // Always default dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('itsec_theme', themeMode);
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // --- Design Settings ---
  const [theme, setThemeState] = useState<ThemeSettings>(defaultThemeSettings);

  useEffect(() => {
    // Load global theme from DB on mount
    fetchSiteSettings().then(settings => {
      const globalThemeStr = settings['global_theme'];
      if (globalThemeStr) {
        try {
          const parsed = JSON.parse(globalThemeStr);
          setThemeState(parsed);
        } catch (e) {
          console.error("Failed to parse global theme", e);
        }
      }
    }).catch(console.error);

    // Subscribe to realtime updates for theme
    const channel = supabase
      .channel('theme_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings', filter: "key=eq.global_theme" }, (payload: any) => {
        if (payload.new && payload.new.value) {
          try {
            const parsed = JSON.parse(payload.new.value);
            setThemeState(parsed);
          } catch (e) {}
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setTheme = useCallback((newTheme: ThemeSettings) => {
    setThemeState(newTheme);
    upsertSiteSetting('global_theme', JSON.stringify(newTheme), 'Global Theme Settings').catch(console.error);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(theme.primaryColor));
    root.style.setProperty('--primary-color-hex', theme.primaryColor);
    
    if (themeMode === 'dark') {
      root.style.setProperty('--background', hexToHsl(theme.backgroundColor));
    } else {
      root.style.removeProperty('--background'); // reset in light mode
    }
    
    if (theme.neonEffect) {
      root.classList.add('neon-theme');
      root.style.setProperty('--neon-glow', `0 0 10px ${theme.primaryColor}, 0 0 20px ${theme.primaryColor}`);
    } else {
      root.classList.remove('neon-theme');
      root.style.setProperty('--neon-glow', 'none');
    }
    
    root.setAttribute('data-texture', theme.texture);
  }, [theme, themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, isDark: themeMode === 'dark', theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const useThemeSettings = useTheme; // alias for the settings part

function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

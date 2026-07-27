import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteSettings } from '@/services/api';

interface SettingsContextType {
  settings: Record<string, string>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  loading: true,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const data = await fetchSiteSettings();
      // Remove quotes from strings if they were saved as JSON strings by mistake
      const cleanData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v.replace(/^"|"$/g, '')])
      );
      setSettings(cleanData);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

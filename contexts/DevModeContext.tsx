import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DevModeContextType {
  isDeveloperMode: boolean;
  toggleDeveloperMode: () => Promise<void>;
  initializeDeveloperMode: () => Promise<void>;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const useDeveloperMode = () => {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDeveloperMode must be used within a DevModeProvider');
  }
  return context;
};

interface DevModeProviderProps {
  children: ReactNode;
}

export const DevModeProvider: React.FC<DevModeProviderProps> = ({ children }) => {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  const initializeDeveloperMode = async () => {
    try {
      const stored = await AsyncStorage.getItem('developer_mode');
      const newMode = stored === 'true';
      setIsDeveloperMode(newMode);
    } catch (error) {
      console.error('Failed to load developer mode:', error);
    }
  };

  const toggleDeveloperMode = async () => {
    try {
      const newMode = !isDeveloperMode;
      setIsDeveloperMode(newMode);
      await AsyncStorage.setItem('developer_mode', newMode.toString());
    } catch (error) {
      console.error('Failed to toggle developer mode:', error);
    }
  };

  React.useEffect(() => {
    initializeDeveloperMode();
  }, []);

  React.useEffect(() => {
    console.log('Developer mode state changed to:', isDeveloperMode);
  }, [isDeveloperMode]);

  const value = {
    isDeveloperMode,
    toggleDeveloperMode,
    initializeDeveloperMode,
  };

  return (
    <DevModeContext.Provider value={value}>
      {children}
    </DevModeContext.Provider>
  );
};

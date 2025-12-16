import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from './context/ThemeContext';

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0088cc',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#212121',
    border: '#e0e0e0',
    notification: '#ff3b30',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#0088cc',
    background: '#0a0a0a',
    card: '#1a1a1a',
    text: '#ffffff',
    border: '#2a2a2a',
    notification: '#ff3b30',
    accent: '#00c9b7',
    surface: '#141414',
  },
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDarkMode ? CustomDarkTheme : CustomLightTheme}>
          <AppNavigator />
          <StatusBar style={isDarkMode ? "light" : "dark"} />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

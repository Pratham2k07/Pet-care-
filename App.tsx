import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const PAW_CURSOR = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZmlsbD0iI0ZGOEJBNyIgZD0iTTEyIDEyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHptLTUuNS0yYzEuMzggMCAyLjUtMS4xMiAyLjUtMi41cy0xLjEyLTIuNS0yLjUtMi41LTIuNSAxLjEyLTIuNSAyLjUgMS4xMiAyLjUgMi41IDIuNXptMTEgMGMxLjM4IDAgMi41LTEuMTIgMi41LTIuNXMtMS4xMi0yLjUtMi41LTIuNS0yLjUgMS4xMi0yLjUgMi41IDEuMTIgMi41IDIuNSAyLjV6bS01LjUtNWMxLjM4IDAgMi41LTEuMTIgMi41LTIuNXMtMS4xMi0yLjUtMi41LTIuNS0yLjUgMS4xMi0yLjUgMi41IDEuMTIgMi41IDIuNSAyLjV6Ii8+PC9zdmc+`;

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.innerHTML = `
        body, html, #root, [data-testid], a, button, [role="button"], * {
          cursor: url('${PAW_CURSOR}') 12 12, auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

/*
 * =============================================================================
 * TaskFlow - ThemeContext (Context API)
 * =============================================================================
 *
 * Arquivo: src/contexts/ThemeContext.tsx
 * Descrição: Contexto global para gerenciamento do tema (claro/escuro).
 *            Utiliza o hook useTheme para persistir a preferência e fornece
 *            o tema atual e função toggleTheme para componentes filhos.
 *
 * Hook de acesso: useThemeContext()
 *
 * Tecnologias: React Context API
 * =============================================================================
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
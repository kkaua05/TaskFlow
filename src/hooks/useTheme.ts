/*
 * =============================================================================
 * TaskFlow - useTheme Hook
 * =============================================================================
 *
 * Arquivo: src/hooks/useTheme.ts
 * Descrição: Hook personalizado que gerencia o tema da aplicação (claro/escuro).
 *            Persiste a preferência no localStorage via useLocalStorage e
 *            aplica/remove as classes CSS 'dark' e 'light' no elemento <html>.
 *            Fornece função toggleTheme para alternar entre os temas.
 *
 * Dependências: useLocalStorage (hook interno)
 *
 * Tecnologias: React (useEffect), DOM API
 * =============================================================================
 */
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
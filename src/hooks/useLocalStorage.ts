/*
 * =============================================================================
 * TaskFlow - useLocalStorage Hook
 * =============================================================================
 *
 * Arquivo: src/hooks/useLocalStorage.ts
 * Descrição: Hook personalizado que gerencia estado persistido no
 *            localStorage do navegador. Permite armazenar e recuperar
 *            valores de qualquer tipo genérico (T) com fallback para
 *            valor inicial caso a chave não exista.
 *
 * Uso: const [value, setValue] = useLocalStorage<T>('key', initialValue)
 *
 * Tecnologias: React (useState), Web Storage API (localStorage)
 * =============================================================================
 */
import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
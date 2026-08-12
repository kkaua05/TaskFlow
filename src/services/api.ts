import { getVisitorId } from './visitorId';

const API_URL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : '/api';

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return { 'X-Visitor-Id': getVisitorId(), ...extra };
}

// Converte camelCase para snake_case para enviar ao backend
function toSnakeCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj instanceof Date) return obj.toISOString();

  const keyMap: Record<string, string> = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    dueDate: 'due_date',
    isFavorite: 'is_favorite',
  };

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = keyMap[key] ?? key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = value instanceof Date ? value.toISOString() : value;
  }
  return result;
}

// Converte snake_case para camelCase, id numérico para string, e datas para Date
function fromBackend(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(fromBackend);

  const keyMap: Record<string, string> = {
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    due_date: 'dueDate',
    is_favorite: 'isFavorite',
  };

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = keyMap[key] || key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    // Converte id numérico para string
    if ((key === 'id' || camelKey === 'id') && typeof value === 'number') {
      result[camelKey] = String(value);
      continue;
    }

    // Converte strings ISO de data para objeto Date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      result[camelKey] = new Date(value);
      continue;
    }

    result[camelKey] = value;
  }
  return result;
}

export const taskApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, { headers: authHeaders() });
      const data = await response.json();
      return data.success ? data.tasks.map(fromBackend) : [];
    } catch {
      return [];
    }
  },
  create: async (task: any) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(toSnakeCase(task))
      });
      const data = await response.json();
      return data.success ? fromBackend(data.task) : null;
    } catch {
      return null;
    }
  },
  update: async (id: string, task: any) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(toSnakeCase(task))
      });
      const data = await response.json();
      return data.success ? fromBackend(data.task) : null;
    } catch {
      return null;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  },
  getStats: async () => {
    try {
      const response = await fetch(`${API_URL}/stats`, { headers: authHeaders() });
      const data = await response.json();
      return data.success ? data.stats : null;
    } catch {
      return null;
    }
  }
};

export const graphNotesApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/graph-notes`, { headers: authHeaders() });
      const data = await response.json();
      return data.success ? data.notes.map(fromBackend) : [];
    } catch {
      return [];
    }
  },
  create: async (note: any) => {
    try {
      const response = await fetch(`${API_URL}/graph-notes`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(toSnakeCase(note))
      });
      const data = await response.json();
      return data.success ? fromBackend(data.note) : null;
    } catch {
      return null;
    }
  },
  update: async (id: string, note: any) => {
    try {
      const response = await fetch(`${API_URL}/graph-notes/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(toSnakeCase(note))
      });
      const data = await response.json();
      return data.success ? fromBackend(data.note) : null;
    } catch {
      return null;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/graph-notes/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await response.json();
      return data.success;
    } catch {
      return false;
    }
  }
};

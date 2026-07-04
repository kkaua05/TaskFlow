const API_URL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : '/api';

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
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    return data.success ? data.tasks.map(fromBackend) : [];
  },
  create: async (task: any) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(task))
    });
    const data = await response.json();
    return data.success ? fromBackend(data.task) : null;
  },
  update: async (id: string, task: any) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(task))
    });
    const data = await response.json();
    return data.success ? fromBackend(data.task) : null;
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    const data = await response.json();
    return data.success;
  },
  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    return data.success ? data.stats : null;
  }
};

export const graphNotesApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/graph-notes`);
    const data = await response.json();
    return data.success ? data.notes.map(fromBackend) : [];
  },
  create: async (note: any) => {
    const response = await fetch(`${API_URL}/graph-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(note))
    });
    const data = await response.json();
    return data.success ? fromBackend(data.note) : null;
  },
  update: async (id: string, note: any) => {
    const response = await fetch(`${API_URL}/graph-notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSnakeCase(note))
    });
    const data = await response.json();
    return data.success ? fromBackend(data.note) : null;
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/graph-notes/${id}`, { method: 'DELETE' });
    const data = await response.json();
    return data.success;
  }
};
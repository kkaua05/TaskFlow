const API_URL = 'http://localhost:5000/api';

export const taskApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    return data.success ? data.tasks : [];
  },
  create: async (task: any) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    const data = await response.json();
    return data.success ? data.task : null;
  },
  update: async (id: string, task: any) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    const data = await response.json();
    return data.success ? data.task : null;
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
    return data.success ? data.notes : [];
  },
  create: async (note: any) => {
    const response = await fetch(`${API_URL}/graph-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    const data = await response.json();
    return data.success ? data.note : null;
  },
  update: async (id: string, note: any) => {
    const response = await fetch(`${API_URL}/graph-notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    const data = await response.json();
    return data.success ? data.note : null;
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/graph-notes/${id}`, { method: 'DELETE' });
    const data = await response.json();
    return data.success;
  }
};
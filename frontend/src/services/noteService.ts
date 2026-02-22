import type { Note } from '../types/Note';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://notes-server-chi.vercel.app/api';

const getAuthHeaders = (token: string | null): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const createNoteService = (token: string | null, userId: string | null) => ({
  async getAllNotes(): Promise<Note[]> {
    if (!userId) throw new Error('User not authenticated');
    const response = await fetch(`${API_BASE_URL}/notes/user/${userId}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async getNoteById(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch note');
    return response.json();
  },

  async createNote(note: Omit<Note, 'id'>): Promise<Note> {
    if (!userId) throw new Error('User not authenticated');
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ ...note, userId })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to create note');
    }

    return data;
  },

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(note)
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete note');
  },

  async toggleArchive(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to toggle archive');
    return response.json();
  }
});

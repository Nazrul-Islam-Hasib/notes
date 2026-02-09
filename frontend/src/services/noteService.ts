import type { Note } from '../types/Note';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user-123';

export const noteService = {
  async getAllNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes/user/${TEMP_USER_ID}`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async getNoteById(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch note');
    return response.json();
  },

  async createNote(note: Omit<Note, 'id'>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...note, userId: TEMP_USER_ID })
    });
    const data = await response.json(); // read ONCE

    if (!response.ok) {
      // backend message + validation errors
      throw new Error(
          data?.message || 'Failed to create note'
      );
    }

    return data;
  },

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete note');
  },

  async toggleArchive(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to toggle archive');
    return response.json();
  }
};

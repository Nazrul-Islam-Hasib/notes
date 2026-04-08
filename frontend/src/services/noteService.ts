import type { Note } from '../types/Note';

import {ENDPOINTS} from "../config/api.ts";

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
    const response = await fetch(ENDPOINTS.notes.allForUser(userId), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async getNoteById(id: string): Promise<Note> {
    const response = await fetch(ENDPOINTS.notes.byId(id), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch note');
    return response.json();
  },

  async createNote(note: Omit<Note, 'id'>): Promise<Note> {
    if (!userId) throw new Error('User not authenticated');
    const response = await fetch(ENDPOINTS.notes.create, {
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
    const response = await fetch(ENDPOINTS.notes.byId(id), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(note)
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  async deleteNote(id: string): Promise<void> {
    const response = await fetch(ENDPOINTS.notes.delete(id), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete note');
  },

  async toggleArchive(id: string): Promise<Note> {
    const response = await fetch(ENDPOINTS.notes.archive(id), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to toggle archive');
    return response.json();
  }
});

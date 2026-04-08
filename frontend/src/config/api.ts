const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://notes-server-chi.vercel.app'

export const ENDPOINTS = {
    auth: {
        register: `${API_BASE_URL}/api/auth/register`,
        login: `${API_BASE_URL}/api/auth/login`,
        me: `${API_BASE_URL}/api/auth/me`,
    },
    notes: {
        allForUser: (userId: string) => `${API_BASE_URL}/api/notes/user/${userId}`,
        byId: (id: string) => `${API_BASE_URL}/api/notes/${id}`,
        create: `${API_BASE_URL}/api/notes`,
        delete: (id: string) => `${API_BASE_URL}/api/notes/${id}`,
        archive: (id: string) => `${API_BASE_URL}/api/notes/${id}/archive`,
    },
    health: `${API_BASE_URL}/api/health`,
}
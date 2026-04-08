# Notes App

A full-stack, secure, and feature-rich note-taking application that allows users to create, manage, and archive their notes. Built with modern web technologies, it features a responsive UI and a robust backend.

### 🌐 Live Demo
- **Live App:** [https://notes-c0182.web.app/](https://notes-c0182.web.app/)

---

### 🚀 Tech Stack

#### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4, DaisyUI 5
- **Icons:** FontAwesome
- **Notifications:** React Toastify
- **Language:** TypeScript

#### Backend
- **Environment:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens), Bcryptjs
- **Validation:** Zod
- **Testing:** Jest, Supertest, MongoDB Memory Server
- **Language:** TypeScript

---

### ✨ Features
- **User Authentication:** Secure Sign Up and Log In functionality.
- **Note Management:** Create, Read, Update, and Delete notes.
- **Archiving:** Archive notes to keep your workspace clean.
- **Responsive Design:** Seamless experience across desktop and mobile devices.
- **Real-time Feedback:** Toast notifications for all major actions.
- **Type Safety:** End-to-end type safety using TypeScript and Zod.

---

### 📂 Project Structure

```text
Notes/
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth and validation middleware
│   │   └── __tests__/      # Backend tests
│   └── tsconfig.json       # TypeScript configuration
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # Auth state management
│   │   ├── services/       # API interaction layer
│   │   └── config/         # App configuration
│   └── vite.config.ts      # Vite configuration
└── README.md               # Project documentation
```

---

### 🛠️ Prerequisites
- **Node.js:** v18.x or higher
- **npm:** v9.x or higher
- **MongoDB:** A local or remote (Atlas) instance
- **Firebase CLI:** (Optional, for frontend deployment)

---

### ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Notes
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` folder:
     ```env
     VITE_API_URL=http://localhost:5000
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

---

### 🧪 Testing
Run backend tests using Jest:
```bash
cd backend
npm test
```

---

### 🛣️ API Endpoints

#### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user details

#### Notes
- `GET /api/notes/user/:userId` - Get all notes for a specific user
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `DELETE /api/notes/:id` - Delete a note
- `PATCH /api/notes/:id/archive` - Archive a note

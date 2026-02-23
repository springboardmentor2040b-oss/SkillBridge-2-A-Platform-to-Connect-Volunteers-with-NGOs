# SkillBridge 🌉

A full-stack web platform that bridges the gap between **volunteers** and **NGOs** — enabling skill-based volunteering opportunities to be discovered, applied for, and managed with ease.

---

## 📸 Features

- 🌙 **Dark/Light Theme Toggle** — persisted across sessions via localStorage
- 📱 **Fully Responsive** — mobile hamburger menu, fluid grid layouts
- 🔐 **Role-Based Auth** — separate flows for Volunteers and NGOs (JWT)
- 📋 **Opportunity Management** — NGOs can post, volunteers can browse & apply
- ✅ **Application Tracking** — NGOs accept/reject, volunteers see real-time status
- 🔍 **Advanced Filtering** — filter by skills, location, and status
- 🛎️ **Toast Notifications** — real-time feedback on all actions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling + dark mode |
| React Router v7 | Client-side routing |
| Axios | API communication |
| Lucide React | Icons |
| React Toastify | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| dotenv | Environment config |
| nodemon | Dev auto-restart |

---

## 📁 Project Structure

```
SkillBridge/
├── backend/                  # Express REST API
│   ├── controllers/          # Route handler logic
│   ├── middleware/           # Auth middleware (JWT)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── utils/                # Helper utilities
│   ├── server.js             # Entry point
│   └── .env                  # Environment variables
│
├── src/                      # React frontend
│   ├── components/
│   │   └── Navbar.jsx        # Shared responsive Navbar + theme toggle
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── ThemeContext.jsx  # Dark/light theme state
│   ├── pages/
│   │   ├── home.jsx
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── opportunities.jsx
│   │   ├── OpportunityDetail.jsx
│   │   ├── CreateOpportunity.jsx
│   │   └── NGOs.jsx
│   ├── utils/
│   │   └── api.js            # Axios instance with base URL
│   └── constants/
│       └── skills.js         # Predefined skills list
│
├── tailwind.config.js
├── vite.config.js
└── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/SkillBridge.git
cd SkillBridge
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:
```bash
npm run dev
```
> Runs on `http://localhost:5000`

### 3. Setup the Frontend
Open a new terminal in the project root:
```bash
npm install
npm run dev
```
> Runs on `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register as Volunteer or NGO |
| POST | `/api/auth/login` | Login and receive JWT token |

### Opportunities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | List all opportunities (with filters) |
| GET | `/api/opportunities/:id` | Get opportunity details |
| POST | `/api/opportunities` | Create opportunity (NGO only) |
| GET | `/api/opportunities/my-opportunities` | NGO's own opportunities |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/:opportunityId` | Apply to an opportunity |
| GET | `/api/applications/my` | Get my applications |
| GET | `/api/applications/ngo` | Get applications received (NGO) |
| PATCH | `/api/applications/:id/status` | Accept or reject (NGO only) |

---

## 👤 User Roles

### Volunteer
- Register with name, email, skills, and location
- Browse and filter opportunities
- Apply with an optional cover letter
- Track application statuses from Dashboard

### NGO
- Register with organization name, description, location, and website
- Post volunteer opportunities
- Review applicant profiles and skill matches
- Accept or reject applications from Dashboard

---

## 🎨 Theme Toggle

The app supports dark and light modes:
- Click the **🌙 / ☀️** icon in the Navbar to toggle
- Preference is saved to `localStorage` and persists across sessions
- Implemented via `ThemeContext` + Tailwind's `darkMode: 'class'`

---

## 📦 Build for Production

```bash
# Frontend
npm run build

# Backend
cd backend && npm start
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

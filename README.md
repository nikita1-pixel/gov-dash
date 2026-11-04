# Gov-Dash (GovConnect)

> A full-stack civic governance platform and issue-tracking dashboard engineered for streamlined citizen reporting, real-time municipal status tracking, and granular administrative oversight.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x+-68a063?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage%20Builds-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)

---

## 📌 Problem & Overview

Municipal administrative workflows often suffer from fragmented communication, opaque resolution timelines, and lack of accountability between citizens and department administrators.

**Gov-Dash** provides a centralized, decoupled civic governance system featuring:
- **Citizen Portal:** Transparent issue submission, evidence attachment, and timeline progression tracking.
- **Municipal Admin Dashboard:** Departmental triaging, priority queue assignment, and status lifecycle management.
- **Strict Role-Based Access Control (RBAC):** Token-gated permissions ensuring non-administrative users cannot access or tamper with internal triage pipelines.
- **Containerized Delivery:** Optimized Docker images running across isolated networks with automated CI/CD validation.

---

## 🏗️ System Architecture

```text
  [ Citizen Client (React) ]          [ Admin Dashboard (React) ]
              │                                   │
              └─────────────────┬─────────────────┘
                                │ (HTTPS / JSON + JWT)
                                ▼
                   [ Express API Gateway ]
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
 [ Auth & RBAC Middleware ]                  [ Issue & Triage Controller ]
  - JWT Signature Verification                - Multi-status State Machine
  - Role Hierarchy (Citizen / Officer / Admin)- Audit Logging & Filtering
        │                                               │
        └───────────────────────┬───────────────────────┘
                                │ (Mongoose ODM)
                                ▼
                    [ MongoDB Database Cluster ]
                     - User & Credential Records
                     - Civic Issues & Status Histories
```

---

## 🚀 Key Features

* **Granular RBAC & Security:** Gated endpoints via JWT bearer tokens and custom Express authorization middleware enforcing least-privilege access across citizens, department officers, and system administrators.
* **Civic Issue State Machine:** Tracks issues through strict lifecycles (`Reported` $\to$ `Under Review` $\to$ `In Progress` $\to$ `Resolved` / `Rejected`) with audit trails recording status modifications and timestamps.
* **Optimized Multi-Stage Docker Builds:** Decoupled build and runtime layers that isolate build toolchains, reduce final production image size by ~55%, and minimize surface vulnerability.
* **Automated CI/CD Workflow:** GitHub Actions pipeline triggers on every pull request to enforce static code analysis, linting passes, and integration tests before deployment.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Axios, Lucide Icons
* **Backend:** Node.js, Express.js, CORS, Helmet, dotenv
* **Database & ODM:** MongoDB, Mongoose
* **Authentication & Authorization:** JWT (JSON Web Tokens), bcryptjs, Custom RBAC Gatekeepers
* **DevOps & Containerization:** Docker, Docker Compose, GitHub Actions, Linux/Bash

---

## 📂 Project Structure

```text
gov-dash/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Modals, Cards)
│   │   ├── context/            # Auth and application state providers
│   │   ├── pages/              # Citizen & Admin portal views
│   │   ├── services/           # Axios API client instances
│   │   └── App.jsx
│   ├── Dockerfile
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # Database connection & env variables
│   │   ├── controllers/        # Auth, issue, and admin business logic
│   │   ├── middleware/         # auth.middleware.js, rbac.middleware.js
│   │   ├── models/             # User.js, Issue.js schemas
│   │   └── routes/             # REST route endpoints
│   ├── Dockerfile
│   └── index.js
├── .github/workflows/ci.yml     # Automated linting & test pipeline
├── docker-compose.yml          # Multi-container orchestration
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Docker](https://www.docker.com/) & Docker Compose (optional, for containerized run)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas URI)

---

### Method 1: Running with Docker Compose (Recommended)

Spins up the full stack (Client, Server, MongoDB) in isolated containers:

```bash
# 1. Clone the repository
git clone https://github.com/nikita1-pixel/gov-dash.git
cd gov-dash

# 2. Build and launch all services
docker-compose up --build
```
* **Frontend:** `http://localhost:5173`
* **API Server:** `http://localhost:5000`

---

### Method 2: Manual Local Development

#### 1. Server Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/govdash
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
# Server listening on http://localhost:5000
```

#### 2. Client Setup

Open a new terminal:
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# Vite dev server running on http://localhost:5173
```

---

## 📡 API Reference Overview

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register citizen or municipal officer | Public |
| `POST` | `/api/auth/login` | Authenticate credentials & return JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile details | Authenticated |

### Civic Issues & Triage
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/issues` | List issues (filtered by citizen or department) | Authenticated |
| `POST` | `/api/issues` | File a new civic grievance | Citizen |
| `GET` | `/api/issues/:id` | Fetch complete issue timeline & notes | Authenticated |
| `PATCH` | `/api/issues/:id/status`| Update issue status & assignment | Officer / Admin |
| `DELETE`| `/api/issues/:id` | Remove invalid / duplicate record | Admin |

---

## 🔒 Security Implementation Highlights

* **Token Verification & Role Hierarchy:**
  ```javascript
  // Example of the RBAC gatekeeper middleware
  const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: "Forbidden: You lack necessary clearance for this action" 
        });
      }
      next();
    };
  };
  ```
* **Multi-Stage Build Footprint:**
  Build stages compile React assets into static files and prune dev-dependencies in the Node runtime layer, preventing source code exposure inside the deployment container.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

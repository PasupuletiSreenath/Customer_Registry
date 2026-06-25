# Customer Registry — Backend

Express + MongoDB API for the Customer Care Registry app (MERN stack project).

## Setup

```bash
cd customer-registry-backend
npm install
```

> **Note on `bcrypt`:** this package compiles a native binary on install. If `npm install`
> fails on your machine with a `node-gyp` / `node-pre-gyp` error, it usually means you're
> missing build tools. Install them first:
> - **Windows:** `npm install -g windows-build-tools` (or install Visual Studio Build Tools)
> - **macOS:** `xcode-select --install`
> - **Linux:** `sudo apt-get install build-essential python3`
>
> If you still have trouble, swap to `bcryptjs` (pure JS, no compilation) — it's a drop-in
> replacement: `npm uninstall bcrypt && npm install bcryptjs`, then change
> `require("bcrypt")` to `require("bcryptjs")` in `controllers/authController.js`.

Update `.env` with your own values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/customer_registry
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Make sure MongoDB is running locally (or use a MongoDB Atlas connection string).

## Run

```bash
npm run dev    # with nodemon, auto-restarts on changes
# or
npm start
```

Server runs at `http://localhost:5000`.

## Folder Structure

```
customer-registry-backend/
├── index.js                 # app entry point, DB connection, server start
├── .env                      # environment variables
├── models/
│   ├── User.js                # customer / admin / agent
│   ├── Complaint.js
│   └── Message.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── complaintRoutes.js
│   └── messageRoutes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── complaintController.js
│   └── messageController.js
└── middleware/
    ├── authMiddleware.js      # JWT verification
    ├── roleMiddleware.js      # role-based access control
    └── errorMiddleware.js     # 404 + global error handler
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user (defaults to `customer` role) |
| POST | `/login` | Public | Login, returns JWT |
| POST | `/logout` | Public | Stateless logout (client discards token) |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/me` | Logged-in user | Get own profile |
| PUT | `/me` | Logged-in user | Update own profile |
| GET | `/` | Admin | List all users (`?role=agent` to filter) |
| GET | `/:id` | Admin | Get one user |
| PUT | `/:id/status` | Admin | Activate/deactivate a user |

### Complaints (`/api/complaints`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Customer | Create a complaint |
| GET | `/` | Any logged-in user | List complaints (scoped by role) |
| GET | `/:id` | Owner / assigned agent / admin | Get one complaint |
| PUT | `/:id/assign` | Admin | Assign complaint to an agent |
| PUT | `/:id/status` | Agent, Admin | Update complaint status |
| PUT | `/:id/feedback` | Customer | Submit rating + feedback |
| DELETE | `/:id` | Admin | Delete a complaint |

### Messages (`/api/messages`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/:complaintId` | Owner / assigned agent / admin | Send a message on a complaint thread |
| GET | `/:complaintId` | Owner / assigned agent / admin | Get full message thread |

## Auth header format

All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

## Testing with Postman

1. `POST /api/auth/register` with `{ "name", "email", "password", "role" }` to create users for each role.
2. `POST /api/auth/login` with `{ "email", "password" }` — copy the returned `token`.
3. Add `Authorization: Bearer <token>` header to all subsequent requests.

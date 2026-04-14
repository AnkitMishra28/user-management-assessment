# User Management System - MERN Stack

A professional, production-ready User Management System with Role-Based Access Control (RBAC) built with the MERN stack.

## ðŸŒŸ Features

### Authentication & Authorization
- JWT-based authentication with access + refresh tokens
- Secure password hashing using bcryptjs
- Protected routes with role-based middleware
- Automatic token refresh mechanism
- Persistent login with localStorage

### Role-Based Access Control (RBAC)
- **Admin**: Full system access, can manage all users, view statistics
- **Manager**: Can view and manage non-admin users
- **User**: Can only access and manage their own profile

### User Management
- Create, read, update, and delete users
- User search with real-time filtering
- Advanced filters by role and status
- Soft delete functionality (users marked inactive cannot login)
- Pagination with configurable page size
- Detailed audit information (createdBy, updatedBy, timestamps)

### Dashboard
- Admin statistics dashboard with user metrics
- Role-based navigation
- Quick access to common features

### User Profile
- View and edit personal information
- Change password functionality
- Audit trail display

## ðŸ› ï¸ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vite** - Build tool

## ðŸ“‹ Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## ðŸš€ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UserManagementSystem_InternAssessment
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/user-management-system

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Start MongoDB (if running locally):

```bash
mongod
```

Seed the database with test data:

```bash
npm run seed
```

This creates:
- Admin: admin@test.com / Admin@123456789
- Manager: manager@test.com / Manager@123456789
- User: john@test.com / John@12345678

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend directory (in a new terminal):

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Configure environment variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## ðŸ“š API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/change-password` - Change password (protected)
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh-token` - Refresh access token

### User Management
- `GET /api/users` - Get all users with pagination (admin/manager)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin/manager/self)
- `DELETE /api/users/:id` - Delete user (soft delete, admin only)
- `GET /api/users/stats` - Get user statistics (admin only)

## ðŸ—ï¸ Project Structure

```
UserManagementSystem_InternAssessment/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ database.js           # MongoDB connection
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ authController.js     # Auth logic
â”‚   â”‚   â””â”€â”€ userController.js     # User management logic
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ authRoutes.js         # Auth endpoints
â”‚   â”‚   â””â”€â”€ userRoutes.js         # User endpoints
â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â””â”€â”€ auth.js               # JWT authentication
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â””â”€â”€ User.js               # User schema
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ authService.js        # Auth business logic
â”‚   â”‚   â””â”€â”€ userService.js        # User business logic
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ errorHandler.js       # Error handling
â”‚   â”‚   â”œâ”€â”€ jwtUtils.js           # JWT utilities
â”‚   â”‚   â”œâ”€â”€ logger.js             # Logging utility
â”‚   â”‚   â””â”€â”€ validators.js         # Input validation
â”‚   â”œâ”€â”€ seeds/
â”‚   â”‚   â”œâ”€â”€ seed.js               # Seed runner
â”‚   â”‚   â””â”€â”€ seedData.js           # Seed data
â”‚   â”œâ”€â”€ server.js                 # Main server file
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ .env.example
â”‚
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ UI.jsx            # Reusable UI components
â”‚   â”‚   â”‚   â”œâ”€â”€ Layout.jsx        # Header & Sidebar
â”‚   â”‚   â”‚   â”œâ”€â”€ Toast.jsx         # Toast notifications
â”‚   â”‚   â”‚   â””â”€â”€ ProtectedRoute.jsx # Protected routing
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ LoginPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ DashboardPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ UsersPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ EditUserPage.jsx
â”‚   â”‚   â”‚   â”œâ”€â”€ CreateUserPage.jsx
â”‚   â”‚   â”‚   â””â”€â”€ ProfilePage.jsx
â”‚   â”‚   â”œâ”€â”€ layouts/
â”‚   â”‚   â”‚   â””â”€â”€ AppLayout.jsx     # Main layout
â”‚   â”‚   â”œâ”€â”€ context/
â”‚   â”‚   â”‚   â””â”€â”€ AuthContext.jsx   # Auth state management
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”‚   â””â”€â”€ index.js          # Custom hooks
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â””â”€â”€ api/
â”‚   â”‚   â”‚       â”œâ”€â”€ client.js     # Axios instance
â”‚   â”‚   â”‚       â””â”€â”€ index.js      # API endpoints
â”‚   â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”‚   â”œâ”€â”€ helpers.js        # Helper functions
â”‚   â”‚   â”‚   â””â”€â”€ toast.js          # Toast utilities
â”‚   â”‚   â”œâ”€â”€ animations/
â”‚   â”‚   â”‚   â””â”€â”€ variants.js       # Framer Motion variants
â”‚   â”‚   â”œâ”€â”€ App.jsx
â”‚   â”‚   â”œâ”€â”€ main.jsx
â”‚   â”‚   â””â”€â”€ index.css
â”‚   â”œâ”€â”€ index.html
â”‚   â”œâ”€â”€ vite.config.js
â”‚   â”œâ”€â”€ tailwind.config.js
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ .env.example
â”‚
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ README.md
â””â”€â”€ .gitignore
```

## ðŸ³ Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Running with Docker

1. Build and start all services:

```bash
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

2. Seed the database (from a new terminal):

```bash
docker-compose exec backend npm run seed
```

3. Stop services:

```bash
docker-compose down
```

## ðŸ”’ Security Best Practices

- âœ… JWT tokens with short expiration times
- âœ… Refresh token rotation mechanism
- âœ… Secure password hashing with bcryptjs
- âœ… Input validation on all endpoints
- âœ… CORS properly configured
- âœ… Environment variables for sensitive data
- âœ… Protected routes with role-based middleware
- âœ… Soft deletes for data preservation
- âœ… Audit trails with createdBy/updatedBy

## ðŸŽ¨ UI/UX Highlights

- Modern, minimal SaaS-style design inspired by Stripe/Linear/Notion
- Glassmorphism and gradient effects
- Smooth Framer Motion animations
- Responsive design (mobile + desktop)
- Loading skeletons for better perceived performance
- Toast notifications for user feedback
- Role-based UI rendering
- Professional typography and spacing

## ðŸ“ API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { /* ... */ }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional information"
  }
}
```

## ðŸ§ª Testing with Demo Credentials

After seeding the database, login with:

| Role    | Email            | Password          |
|---------|------------------|-------------------|
| Admin   | admin@test.com   | Admin@123456789   |
| Manager | manager@test.com | Manager@123456789 |
| User    | john@test.com    | John@12345678     |

## ðŸŒ Deployment

### Backend (Render/Railway)
1. Push code to Git repository
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to Git repository
2. Connect repository to Vercel/Netlify
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

### MongoDB (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in backend environment variables

## ðŸ“ž Support & Contribution

For issues and feature requests, please create an issue in the repository.

## ðŸ“„ License

This project is licensed under the MIT License - see the LICENSE file for details.

## âœ¨ Key Features Summary

- âœ… Complete MERN stack implementation
- âœ… Role-based access control (RBAC)
- âœ… JWT authentication with refresh tokens
- âœ… Beautiful, production-ready UI
- âœ… Responsive design
- âœ… Error handling and validation
- âœ… Pagination and filtering
- âœ… Soft delete functionality
- âœ… Audit trails
- âœ… Docker support
- âœ… Deployment ready
- âœ… Clean, modular, scalable code

---

**Built with â¤ï¸ by a professional full-stack engineer**

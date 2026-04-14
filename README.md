# User Management System - MERN Stack

A professional, production-ready User Management System with Role-Based Access Control (RBAC) built with the MERN stack.

## Features

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

## Tech Stack

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

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Getting Started

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
- User: ankit@test.com / Ankit@12345678

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

## API Endpoints

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

## Project Structure

```
UserManagementSystem_InternAssessment/
backend/
config/
   database.js           # MongoDB connection
controllers/
 authController.js     # Auth logic
 userController.js     # User management logic
routes/
authRoutes.js         # Auth endpoints
 userRoutes.js         # User endpoints
middleware/
auth.js               # JWT authentication
models/
 User.js               # User schema
services/
authService.js        # Auth business logic
userService.js        # User business logic
utils/
errorHandler.js       # Error handling
jwtUtils.js           # JWT utilities
logger.js             # Logging utility
validators.js         # Input validation
seeds/
 seed.js               # Seed runner
seedData.js           # Seed data
server.js                 # Main server file
package.json
.env.example
 frontend/
  src/
     components/
    UI.jsx            # Reusable UI components
    Layout.jsx        # Header & Sidebar
    Toast.jsx         # Toast notifications
    ProtectedRoute.jsx # Protected routing
     pages/
     LoginPage.jsx
     DashboardPage.jsx
     UsersPage.jsx
     EditUserPage.jsx
     CreateUserPage.jsx
     ProfilePage.jsx
     layouts/
     AppLayout.jsx     # Main layout
    context/
    AuthContext.jsx   # Auth state management
    hooks/
     index.js          # Custom hooks
    services/
     api/
     client.js     # Axios instance
     index.js      # API endpoints
    utils/
    helpers.js        # Helper functions
    toast.js          # Toast utilities
     animations/
    variants.js       # Framer Motion variants
    App.jsx
    main.jsx
    index.css
  index.html
  vite.config.js
  tailwind.config.js
  package.json
  .env.example
docker-compose.yml
README.md
.gitignore
```

## Docker Setup

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

## Security Best Practices

- JWT tokens with short expiration times
- Refresh token rotation mechanism
- Secure password hashing with bcryptjs
- Input validation on all endpoints
- CORS properly configured
- Environment variables for sensitive data
- Protected routes with role-based middleware
- Soft deletes for data preservation
- Audit trails with createdBy/updatedBy

## UI/UX Highlights

- Modern, minimal SaaS-style design inspired by Stripe/Linear/Notion
- Glassmorphism and gradient effects
- Smooth Framer Motion animations
- Responsive design (mobile + desktop)
- Loading skeletons for better perceived performance
- Toast notifications for user feedback
- Role-based UI rendering
- Professional typography and spacing

## API Response Format

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

## Testing with Demo Credentials

After seeding the database, login with:

| Role    | Email            | Password          |
|---------|------------------|-------------------|
| Admin   | admin@test.com   | Admin@123456789   |
| Manager | manager@test.com | Manager@123456789 |
| User    | john@test.com    | John@12345678     |

## Deployment

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

## Support & Contribution

For issues and feature requests, please create an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Key Features Summary

- Complete MERN stack implementation
- Role-based access control (RBAC)
- JWT authentication with refresh tokens
- Beautiful, production-ready UI
- Responsive design
- Error handling and validation
- Pagination and filtering
- Soft delete functionality
- Audit trails
- Docker support
- Deployment ready
- Clean, modular, scalable code

---

**Built by a professional full-stack engineer**

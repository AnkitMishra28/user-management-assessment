# Quick Start Guide

## Prerequisites

- Node.js v16+ installed
- MongoDB running locally (or use MongoDB Atlas)
- npm or yarn

## Option 1: Local Development (Recommended for First Time)

### Step 1: Backend Setup (Terminal 1)

```bash
cd backend
npm install
npm run seed    # Seeds database with test users
npm run dev     # Starts backend on http://localhost:5000
```

### Step 2: Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev     # Starts frontend on http://localhost:3000
```

### Step 3: Open in Browser

Visit: **http://localhost:3000**

Login with one of these credentials:
- **Admin**: admin@test.com / Admin@123456789
- **Manager**: manager@test.com / Manager@123456789
- **User**: john@test.com / John@12345678

---

## Option 2: Docker (Production-like Setup)

### Prerequisites
- Docker installed
- Docker Compose installed

### Run with Docker

```bash
# Build and start all services
docker-compose up --build

# In another terminal, seed the database (optional)
docker-compose exec backend npm run seed
```

Services available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## Project Structure Quick Reference

```
backend/
models/User.js          # Database schema
controllers/            # API logic
services/               # Business logic
routes/                 # API endpoints
middleware/auth.js      # Authentication
seeds/seed.js          # Database seeding

frontend/
 pages/                 # Page components
 components/            # Reusable UI components
 context/AuthContext    # Global auth state
 services/api/          # API calls
 hooks/                 # Custom hooks
```

---

## Key Files to Review

**Backend:**
- `backend/server.js` - Main entry point
- `backend/models/User.js` - User database model
- `backend/middleware/auth.js` - JWT authentication logic
- `backend/services/userService.js` - User management logic

**Frontend:**
- `frontend/src/App.jsx` - Routes and main app structure
- `frontend/src/context/AuthContext.jsx` - Authentication state
- `frontend/src/pages/DashboardPage.jsx` - Main dashboard
- `frontend/src/pages/UsersPage.jsx` - User management page

---

## Testing

### Admin Dashboard Features
1. Login as admin@test.com
2. Go to Dashboard - see user statistics
3. Go to Users - manage all users
4. Create new users
5. Edit and delete users

### Manager Features
1. Login as manager@test.com
2. Can view users (non-admin only)
3. Can view their profile

### User Features
1. Login as john@test.com
2. Can only see their profile
3. Can change their password

---

##  Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/user-management-system
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

##  Common Tasks

### Reset Database
```bash
cd backend
npm run seed
```

### Check Backend APIs
```bash
# View all users
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/users

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin@123456789"}'
```

### Stop Everything
```bash
# For docker
docker-compose down

# For local
# Press Ctrl+C in both terminals
```

---

##  Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas and update `MONGODB_URI`

### Port Already in Use
- Backend port 5000: `lsof -i :5000` then `kill -9 <PID>`
- Frontend port 3000: `lsof -i :3000` then `kill -9 <PID>`

### CORS Error
- Check that `CORS_ORIGIN` in backend .env matches frontend URL
- Default: `http://localhost:3000`

### Token Expired
- Clear browser localStorage and login again
- Or refresh the page

---

## Next Steps

1. **Explore the Dashboard** - Get familiar with the UI
2. **Review the Code** - Study the architecture
3. **Try All Features** - Create/edit/delete users
4. **Test RBAC** - Switch between different roles
5. **Check API** - Use browser DevTools Network tab

---

##  Need Help?

Check these files for more info:
- `README.md` - Full documentation
- `backend/server.js` - Backend structure
- `frontend/src/App.jsx` - Frontend routing

---

**Happy coding!**

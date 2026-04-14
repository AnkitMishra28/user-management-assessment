# Architecture & Design Document

## System Overview

This is a complete MERN stack application implementing a User Management System with Role-Based Access Control (RBAC). The system is production-ready, secure, and follows best practices.

##  Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         React Frontend              │
│  (Components, Pages, Hooks)         │
├─────────────────────────────────────┤
│     API Layer (Axios)               │
├─────────────────────────────────────┤
│     Express.js REST API             │
├─────────────────────────────────────┤
│    Services & Business Logic        │
├─────────────────────────────────────┤
│    Middleware & Authentication      │
├─────────────────────────────────────┤
│    MongoDB Database & Models        │
└─────────────────────────────────────┘
```

##  Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend sends to /auth/login
   ↓
3. Backend validates input
   ↓
4. Password compared with hash
   ↓
5. JWT tokens generated (access + refresh)
   ↓
6. Tokens stored in localStorage
   ↓
7. User authenticated & logged in
```

##  RBAC Implementation

### Role Hierarchy
```
Admin     → Full system access
   ↓
Manager   → Manage non-admin users
   ↓
User      → Self-service only
```

### Authorization Matrix

| Feature | Admin | Manager | User |
|---------|-------|---------|------|
| View Dashboard Stats | ✅ | ❌ | ❌ |
| List All Users | ✅ | ✅ | ❌ |
| Create User | ✅ | ❌ | ❌ |
| Edit User | ✅ | ✅* | ✅ (own) |
| Delete User | ✅ | ❌ | ❌ |
| Change Status | ✅ | ❌ | ❌ |
| View Profile | ✅ | ✅ | ✅ |
| Change Password | ✅ | ✅ | ✅ |

*Managers can only edit non-admin users

##  Data Models

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['admin', 'manager', 'user'],
  status: Enum ['active', 'inactive'],
  createdBy: ObjectId (reference to User),
  updatedBy: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  refreshTokens: [{ token, createdAt }]
}
```

##  Token Management

### Access Token
- Short-lived (15 minutes)
- Stored in memory/localStorage
- Sent with every API request
- Contains: userId, email, role

### Refresh Token
- Long-lived (7 days)
- Stored in httpOnly cookie (optional)
- Used to request new access tokens
- Contains: userId only

### Token Refresh Flow
```
1. Access token expires
   ↓
2. API returns 401 Unauthorized
   ↓
3. Frontend intercepts response
   ↓
4. Sends refresh token to /auth/refresh-token
   ↓
5. Backend validates refresh token
   ↓
6. Returns new access token
   ↓
7. Retries original request
```

##  Security Features

### Input Validation
- Email format validation
- Password strength validation (8+ chars, uppercase, lowercase, number, special)
- Trim whitespace
- Type checking

### Password Security
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Never returned in API responses
- Temporary password reset not implemented (add if needed)

### Request Authentication
- JWT middleware on protected routes
- Token validation with signature check
- Expiration checking

### Authorization Middleware
- Role-based access control
- User can only modify own profile (unless admin)
- Manager restrictions on admin users
- Admin-only endpoints protected

### Error Handling
- No sensitive data in error messages
- Proper HTTP status codes
- Centralized error handler
- Logging of errors for debugging

##  Frontend Architecture

### State Management
- **AuthContext** - Global auth state (user, tokens)
- **Component State** - Form data, UI states
- **Local Storage** - Persistent user data

### Component Hierarchy
```
App
├── AuthProvider (Context)
├── Router
│   ├── LoginPage
│   └── AppLayout (if authenticated)
│       ├── Header
│       ├── Sidebar
│       └── Routes
│           ├── DashboardPage
│           ├── UsersPage
│           ├── EditUserPage
│           ├── CreateUserPage
│           ├── ProfilePage
│           └── SettingsPage
```

### Custom Hooks
- `useAuth()` - Access auth context
- `useToast()` - Manage toast notifications
- `useLoading()` - Handle loading states
- `usePagination()` - Pagination logic
- `useModal()` - Modal open/close

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout  
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh token

### User Management
- `GET /api/users` - List users (paginated)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft)
- `GET /api/users/stats` - Get statistics (admin)

## 📈 Error Handling Strategy

### Frontend Error Handling
```
API Call
   ↓
   ├─ Success → Show data
   ├─ 401 → Refresh token & retry
   ├─ 403 → Show unauthorized page
   ├─ 4xx → Show validation error
   └─ 5xx → Show generic error
```

### Backend Error Handling
```
Request
   ↓
   ├─ Middleware (validation)
   ├─ Route handler
   ├─ Service layer (business logic)
   └─ Error → Central error handler
         ↓
      Format response
         ↓
      Send error to client
```

##  Scalability Considerations

### Current Implementation
- Single MongoDB database
- Express.js single instance
- React SPA frontend

### Future Improvements
- Add caching (Redis)
- Implement rate limiting
- Add request logging/monitoring
- Separate microservices
- Message queue for async tasks
- CDN for static assets

##  Best Practices Implemented

 **Code Organization**
- Separation of concerns
- Modular components
- Reusable utilities

 **Error Handling**
- Try-catch blocks
- Centralized error handler
- User-friendly messages

 **Security**
- Password hashing
- JWT authentication
- Input validation
- CORS configuration

 **Performance**
- Pagination on lists
- Loading skeletons
- Optimized re-renders
- Lazy loading routes

 **User Experience**
- Smooth animations
- Toast notifications
- Form validation
- Loading states

 **Code Quality**
- Consistent naming
- Comments on complex logic
- DRY principle
- Type-safe where applicable

##  Testing Recommendations

### Backend Tests
- Unit tests for services
- Integration tests for API endpoints
- Authentication middleware tests
- Authorization logic tests

### Frontend Tests
- Component rendering tests
- Form validation tests
- API integration tests
- Route protection tests

##  Deployment Readiness

### Environment Configuration
- All secrets in environment variables
- No hardcoded values
- Different configs for dev/prod

### Database
- Indexes on frequently queried fields
- Connection pooling
- Atlas backup enabled

### Frontend Build
- Minified and optimized
- Source maps for debugging
- Asset caching

### Backend Deployment
- Node cluster support
- Graceful shutdown
- Health check endpoint

---

**This architecture ensures scalability, security, and maintainability.**

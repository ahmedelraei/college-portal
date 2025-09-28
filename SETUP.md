# College Portal Setup Guide

This guide will help you set up the College Portal with session-based authentication using GraphQL, React Query, and NestJS with Fastify.

## Architecture Overview

### Backend (NestJS + Fastify + GraphQL)

- **Framework**: NestJS with Fastify adapter
- **GraphQL**: Apollo Server with code-first approach
- **Authentication**: Session-based with secure cookies
- **Database**: PostgreSQL with TypeORM
- **Session Storage**: Fastify secure sessions

### Frontend (Next.js + React Query + Apollo Client)

- **Framework**: Next.js 15 with App Router
- **State Management**: React Query (TanStack Query)
- **GraphQL Client**: Apollo Client
- **UI**: Tailwind CSS + Radix UI components
- **Forms**: React Hook Form with Zod validation

## Setup Instructions

### 1. Install Dependencies

#### Backend

```bash
cd apps/backend
npm install
```

#### Frontend

```bash
cd apps/frontend
npm install
```

### 2. Environment Variables

#### Backend (.env)

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=college_portal

# Session
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
SESSION_SALT=mq9hDxBVDbspDR6n

# Server
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/graphql
```

### 3. Database Setup

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE college_portal;
```

The TypeORM entities will automatically create the necessary tables when you start the backend.

### 4. Start the Applications

#### Backend (Terminal 1)

```bash
cd apps/backend
npm run dev
```

The backend will start on http://localhost:8080
GraphQL Playground will be available at http://localhost:8080/graphql

#### Frontend (Terminal 2)

```bash
cd apps/frontend
npm run dev
```

The frontend will start on http://localhost:3000

## Key Features Implemented

### Session-Based Authentication

- ✅ Secure session cookies with Fastify
- ✅ Session storage in memory (can be extended to Redis)
- ✅ Automatic session cleanup on logout
- ✅ CORS configured for credentials

### GraphQL API

- ✅ Login mutation with session creation
- ✅ Logout mutation with session cleanup
- ✅ Register mutation for new users
- ✅ Me query to get current user
- ✅ isAuthenticated query to check auth status

### Frontend Integration

- ✅ Apollo Client with credentials support
- ✅ React Query for state management
- ✅ Custom auth hooks with error handling
- ✅ Form validation with Zod
- ✅ Loading states and error messages
- ✅ Automatic redirects based on auth state
- ✅ Auth guard component

### UI/UX

- ✅ Beautiful login page with university branding
- ✅ Loading spinners and disabled states
- ✅ Toast notifications for feedback
- ✅ Responsive design
- ✅ Form validation errors
- ✅ Logout functionality in dashboard

## GraphQL Operations

### Login

```graphql
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    user {
      id
      studentId
      email
      firstName
      lastName
      role
    }
    message
  }
}
```

### Register

```graphql
mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    id
    studentId
    email
    firstName
    lastName
    role
  }
}
```

### Get Current User

```graphql
query Me {
  me {
    id
    studentId
    email
    firstName
    lastName
    role
  }
}
```

### Logout

```graphql
mutation Logout {
  logout {
    message
  }
}
```

## Testing the System

1. **Start both backend and frontend**
2. **Visit http://localhost:3000** - should redirect to login
3. **Try to access http://localhost:3000/dashboard** - should redirect to login
4. **Register a new user** (if needed via GraphQL playground)
5. **Login with valid credentials**
6. **Should redirect to dashboard with user info**
7. **Click logout** - should clear session and redirect to login

## Development Tools

- **GraphQL Playground**: http://localhost:8080/graphql
- **React Query Devtools**: Available in browser (development only)
- **Apollo Client Devtools**: Install browser extension for debugging

## Security Features

1. **Secure Session Cookies**: HttpOnly, Secure in production, SameSite
2. **CORS Protection**: Configured for specific origins
3. **Password Hashing**: bcryptjs with salt rounds
4. **Input Validation**: Class validators and Zod schemas
5. **Error Handling**: Sanitized error messages
6. **Session Expiry**: 24-hour session timeout

## Next Steps

- Add Redis for session storage in production
- Implement password reset functionality
- Add role-based access control
- Add refresh token mechanism
- Implement rate limiting
- Add comprehensive logging
- Add unit and integration tests

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure FRONTEND_URL is set correctly in backend .env
2. **Session Not Persisting**: Check that credentials: 'include' is set in Apollo Client
3. **GraphQL Errors**: Check the GraphQL playground for detailed error messages
4. **Database Connection**: Ensure PostgreSQL is running and connection details are correct
5. **Port Conflicts**: Make sure ports 3000 and 8080 are available

### Debug Mode

Enable debug logging in the backend:

```env
NODE_ENV=development
```

Check browser network tab for GraphQL requests and responses.

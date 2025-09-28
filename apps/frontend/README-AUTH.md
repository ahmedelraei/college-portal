# Authentication System Documentation

## Overview

This authentication system uses **session-based authentication** with **GraphQL** and **native Next.js** features (no React Query). The system provides secure login/logout functionality for the Modern Academy Student Portal.

## Architecture

### Backend (NestJS + GraphQL)

- **Session-based authentication** using express-session
- **GraphQL resolvers** for authentication operations
- **Password hashing** with bcrypt
- **Student entity** with role-based access

### Frontend (Next.js + Apollo Client)

- **Apollo Client** for GraphQL communication
- **Native React Context** for state management
- **Custom hooks** for authentication operations
- **Session persistence** via HTTP cookies

## Key Components

### 1. Authentication Provider (`/components/auth/auth-provider.tsx`)

```tsx
<AuthProvider>{/* Your app components */}</AuthProvider>
```

Provides authentication context throughout the app with:

- User state management
- Login/logout functions
- Authentication status checking
- Automatic session validation

### 2. Authentication Hook (`/hooks/useAuth.ts`)

```tsx
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

### 3. Auth Guard (`/components/auth-guard.tsx`)

```tsx
<AuthGuard requireAuth={true}>{/* Protected content */}</AuthGuard>
```

### 4. Auth Status Component (`/components/auth/auth-status.tsx`)

```tsx
<AuthStatus /> // Shows user info and logout button
<UserProfile /> // Detailed user profile card
```

## Usage Examples

### Protecting Routes

```tsx
// In a protected page
export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>Protected content here</div>
    </AuthGuard>
  );
}
```

### Using Authentication in Components

```tsx
function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Login Form

```tsx
const handleLogin = async (data) => {
  try {
    await login(data); // { studentId, password }
    router.push("/dashboard");
  } catch (error) {
    // Error handling (toast notifications handled automatically)
  }
};
```

## Available Routes

- `/login` - Student login page
- `/dashboard` - Protected dashboard (requires authentication)

## GraphQL Operations

### Mutations

- `login(loginInput: LoginInput!)` - Authenticate user
- `logout` - End user session

### Queries

- `me` - Get current user information
- `isAuthenticated` - Check authentication status

## Security Features

- **Session-based authentication** (no JWT tokens in localStorage)
- **HTTP-only cookies** for session storage
- **Password hashing** with bcrypt (12 rounds)
- **CSRF protection** via session cookies
- **GraphQL error handling** with user-friendly messages
- **Automatic session validation** on app load

## Session Management

Sessions are managed server-side with the following benefits:

- **Secure**: Session data stored on server
- **Automatic expiry**: Sessions expire after inactivity
- **Revokable**: Sessions can be invalidated server-side
- **Cross-tab sync**: Authentication state syncs across browser tabs

## Development

### Starting the Application

```bash
# Backend (from /apps/backend)
npm run start:dev

# Frontend (from /apps/frontend)
npm run dev
```

### Environment Variables

```env
# Backend
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key

# Frontend
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/graphql
```

## Testing

### Manual Testing

1. Use existing test credentials to authenticate
2. Visit `/login` to authenticate
3. Navigate to protected routes to verify auth guard
4. Test logout functionality
5. Verify session persistence across browser refreshes

### Test Credentials

```
Student ID: CB2024001
Password: testpass123
```

## Migration from React Query

The system was migrated from React Query to native Next.js for:

- **Reduced bundle size**: Removed unnecessary dependencies
- **Simplified state management**: Direct React context usage
- **Better SSR compatibility**: Native Next.js patterns
- **Improved performance**: Less abstraction layers

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `credentials: 'include'` in Apollo Client
2. **Session Not Persisting**: Check cookie settings and HTTPS in production
3. **GraphQL Errors**: Check network tab for detailed error messages
4. **Auth State Not Updating**: Verify AuthProvider wraps your app

### Debug Mode

```tsx
// Enable Apollo Client devtools
const client = new ApolloClient({
  // ... config
  connectToDevTools: process.env.NODE_ENV === "development",
});
```

## Future Enhancements

- [ ] Password reset functionality
- [ ] Remember me option
- [ ] Multi-factor authentication
- [ ] Role-based route protection
- [ ] Session timeout warnings
- [ ] Audit logging

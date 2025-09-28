# College Portal - Student Registration System

A comprehensive web-based college registration system built with Next.js and NestJS, featuring course management, student registration, payment processing, and academic record tracking.

## 🚀 Features

### For Students

- **User Authentication**: Secure login/register with student ID and password
- **Course Catalog**: Browse and search available courses with filters
- **Smart Registration**: Automatic prerequisite checking and credit hour validation
- **Payment Processing**: Secure mock payment system with credit card simulation
- **Academic Records**: View grades, GPA calculation, and transcript
- **Dashboard**: Overview of registered courses and academic progress

### For Administrators

- **Course Management**: Create, edit, and manage course catalog
- **Student Management**: View and manage student records
- **Registration Oversight**: Monitor and manage student registrations
- **Payment Tracking**: View payment history and statistics
- **Grade Management**: Enter and update student grades

## 🛠️ Technology Stack

### Backend

- **NestJS** - Node.js framework with TypeScript
- **PostgreSQL** - Primary database
- **TypeORM** - Database ORM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Docker** - Containerization

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - API client
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

#### Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd college-portal

# Start all services (database, backend, frontend)
./scripts/start-dev.sh

# Or manually:
docker-compose up --build -d
```

#### Production Environment

```bash
# Create production environment file
cp .env.example .env
# Edit .env with your production values

# Start production services
./scripts/start-prod.sh

# Or manually:
docker-compose -f docker-compose.prod.yml up --build -d
```

### Option 2: Manual Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd college-portal
```

#### 2. Start the Database

```bash
docker-compose up postgres -d
```

#### 3. Set Up Backend

```bash
cd apps/backend

# Create .env file from .env.example
cp .env.example .env

# Install dependencies
pnpm install

# Run database migrations and seed data
pnpm run seed

# Start the backend server
pnpm run dev
```

#### 4. Set Up Frontend

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Start the frontend server
pnpm run dev
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 🔐 Demo Accounts

### Student Account

- **Student ID**: `STU001`
- **Password**: `password123`
- **Features**: Course registration, payments, transcript viewing

### Admin Account

- **Student ID**: `ADM001`
- **Password**: `admin123`
- **Features**: Full administrative access

## 🐳 Docker Deployment

### Development Environment

```bash
# Start all services with hot reload
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

### Production Environment

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Database Management

```bash
# Reset database with fresh data (development)
docker-compose exec backend pnpm run seed:reset

# Clear all data
docker-compose exec backend pnpm run seed:clear

# Seed sample data only
docker-compose exec backend pnpm run seed

# Production database setup
docker-compose -f docker-compose.prod.yml exec backend pnpm run seed
```

### Docker Commands

```bash
# View running containers
docker-compose ps

# Access backend container
docker-compose exec backend sh

# Access frontend container
docker-compose exec frontend sh

# Access database
docker-compose exec postgres psql -U postgres -d college_portal

# Clean up (remove containers, networks, volumes)
docker-compose down -v --remove-orphans
```

## 📊 Database Schema

### Core Entities

#### Students

- Student ID, name, email, password
- Role (student/admin), GPA tracking
- Relationship to registrations and payments

#### Courses

- Course code, name, description
- Credit hours, pricing, semester
- Prerequisites (many-to-many self-relation)

#### Registrations

- Student-course enrollment records
- Payment status, grades, completion tracking
- Semester and year tracking

#### Payments

- Payment processing records
- Transaction details, status tracking
- Integration with registration system

## 🔧 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - User logout

### Courses

- `GET /courses` - List courses with filters
- `GET /courses/:id` - Get course details
- `POST /courses` - Create course (admin)
- `PUT /courses/:id` - Update course (admin)
- `DELETE /courses/:id` - Delete course (admin)

### Registrations

- `POST /registrations` - Register for course
- `POST /registrations/bulk` - Bulk registration
- `GET /registrations/me` - Get my registrations
- `DELETE /registrations/:id/drop` - Drop course

### Payments

- `POST /payments` - Create payment
- `POST /payments/:id/process` - Process payment
- `GET /payments/me` - Get payment history

## 🎯 Business Rules

### Registration Rules

- Maximum 18 credit hours per semester
- Prerequisites must be completed with passing grade
- Payment required to complete registration
- Refunds available within 1 week of registration

### Grading System

- Letter grades: A (4.0), B (3.0), C (2.0), D (1.0), F (0.0)
- GPA calculated as weighted average by credit hours
- Only completed courses count toward GPA

### Payment System

- Tuition calculated as credit hours × $500 per credit
- Mock payment system simulates real payment flow
- Automatic receipt generation and confirmation

## 🧪 Testing

### Mock Payment Testing

Use these test card numbers in the payment form:

- **Success**: Any 16-digit number except those below
- **Declined**: `4000000000000002`
- **Invalid CVV**: Use CVV `000`
- **Expired Card**: Use any past expiry date

## 📝 Development

### Project Structure

```
college-portal/
├── apps/
│   ├── backend/          # NestJS API server
│   │   ├── src/
│   │   │   ├── entities/     # Database entities
│   │   │   ├── modules/      # Feature modules
│   │   │   ├── seeds/        # Database seeding
│   │   │   └── lib/          # Shared utilities
│   │   └── Dockerfile
│   └── frontend/         # Next.js web application
│       ├── app/              # App router pages
│       ├── components/       # React components
│       ├── lib/              # Utilities and API client
│       └── Dockerfile
├── docker-compose.yml    # Container orchestration
└── README.md
```

### Environment Variables

#### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=college_portal

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=30m

# Application
NODE_ENV=development
PORT=8080
```

#### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation above
- Review the demo accounts section
- Examine the API endpoints
- Check Docker logs for troubleshooting

## 🔮 Future Enhancements

- Email notifications for registration and payments
- Advanced reporting and analytics
- Mobile responsive improvements
- Integration with external payment processors
- Course waitlist functionality
- Academic calendar integration

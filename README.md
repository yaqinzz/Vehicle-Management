# Vehicle Management System

A comprehensive vehicle management system built with React (frontend) and Node.js/Express (backend), featuring user authentication, vehicle tracking, and reporting capabilities.

## 🚀 Live Demo

- **Production**: https://vehiclemanagement.online (SSL enabled)
- **Alternative Access**: http://31.97.223.229:8000
- **pgAdmin**: http://31.97.223.229:8080

### Test Credentials
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Development Environment Setup](#development-environment-setup)
- [Deployment Guide](#deployment-guide)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React SPA     │───▶│  Express API    │───▶│  PostgreSQL     │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │                 │              │
         └─────────────▶│   nginx Proxy   │◀─────────────┘
                        │  (Load Balancer)│
                        │                 │
                        └─────────────────┘
```

### Deployment Architecture
```
┌──────────────────────────────────────────────────────────────┐
│                        VPS Server                            │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐ │
│  │  System nginx   │  │         Docker Environment          │ │
│  │  (SSL/HTTPS)    │  │  ┌─────────────────────────────────┐ │ │
│  │  Port 80/443    │  │  │         Docker nginx            │ │ │
│  │                 │  │  │         Port 8000               │ │ │
│  └─────────────────┘  │  │  ┌─────────────────────────────┐ │ │
│                       │  │  │ Frontend │ Backend │ DB    │ │ │
│                       │  │  │  :3000   │  :4000  │:5432  │ │ │
│                       │  │  └─────────────────────────────┘ │ │
│                       │  └─────────────────────────────────┐ │ │
│                       └──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **JWT** for authentication
- **Winston** for logging
- **Helmet** for security headers

### Database
- **PostgreSQL 15** for data persistence
- **pgAdmin 4** for database management

### DevOps & Deployment
- **Docker** for containerization
- **Docker Compose** for orchestration
- **GitHub Actions** for CI/CD
- **nginx** for reverse proxy
- **Let's Encrypt** for SSL certificates

## 💻 Development Environment Setup

### Prerequisites
- **Node.js** 20+ and npm
- **Docker** and Docker Compose
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/yaqinzz/Vehicle-Management.git
cd Vehicle-Management
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/vehicle_db"
# JWT_SECRET="your-secret-key"
# FRONTEND_URL="http://localhost:3000"

# Start PostgreSQL with Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vehicle_db -p 5432:5432 -d postgres:15-alpine

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run seed

# Start development server
npm run dev
```

Backend will be available at: http://localhost:4000

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env:
# VITE_API_URL="http://localhost:4000/api"

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

### 4. Development with Docker (Optional)
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## 🚢 Deployment Guide

### Prerequisites for Production
- **Linux VPS** with root access
- **Domain name** (optional, for SSL)
- **Docker** and Docker Compose installed on server

### 1. Server Setup
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Create deployment directory
mkdir -p ~/vehicle-deploy
cd ~/vehicle-deploy
```

### 2. Environment Configuration
```bash
# Create environment files in ~/vehicle-deploy/
touch backend.env

# backend.env content:
DATABASE_URL="postgresql://postgres:your-password@postgres:5432/vehicle_db"
JWT_SECRET="your-production-jwt-secret"
FRONTEND_URL="https://yourdomain.com"
NODE_ENV="production"
```

### 3. GitHub Actions Deployment
The project includes automated CI/CD. Set up these GitHub Secrets:

```bash
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token
VPS_HOST=your-server-ip
VPS_USER=root
VPS_SSH_KEY=your-private-ssh-key
POSTGRES_PASSWORD=your-db-password
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=your-pgadmin-password
```

### 4. SSL Setup (Optional)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Install nginx
apt install nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Configure nginx to proxy to Docker (see deploy/nginx-ssl.conf)
```

### 5. Manual Deployment
```bash
# On server
cd ~/vehicle-deploy

# Pull and start containers
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Run database migrations
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed database (first time only)
docker compose -f docker-compose.prod.yml exec backend npm run seed
```

### 6. Monitoring & Maintenance
```bash
# View container status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Update application
git push origin main  # Triggers automatic deployment

# Manual backup database
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres vehicle_db > backup.sql
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/login      # User login
POST /api/auth/refresh    # Refresh token
POST /api/auth/logout     # User logout
```

### User Management
```
GET    /api/users         # Get all users (admin)
GET    /api/users/:id     # Get user by ID
POST   /api/users         # Create user (admin)
PUT    /api/users/:id     # Update user
DELETE /api/users/:id     # Delete user (admin)
```

### Vehicle Management
```
GET    /api/vehicles      # Get all vehicles
GET    /api/vehicles/:id  # Get vehicle by ID
POST   /api/vehicles      # Create vehicle
PUT    /api/vehicles/:id  # Update vehicle
DELETE /api/vehicles/:id  # Delete vehicle
```

### Reports
```
GET /api/reports/trips/stats     # Get trip statistics
GET /api/reports/trips/download  # Download trips Excel
```

Full API documentation available at: `/api/docs` (Swagger UI)

## 📁 Project Structure

```
Vehicle-Management/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema & migrations
│   ├── tests/               # Unit & integration tests
│   └── Dockerfile           # Backend container
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # API & utility functions
│   │   ├── services/        # API services
│   │   ├── stores/          # State management
│   │   └── types/           # TypeScript types
│   └── Dockerfile           # Frontend container
├── deploy/                  # Deployment configurations
│   ├── docker-compose.prod.yml
│   ├── nginx.conf
│   └── *.env.example
├── .github/workflows/       # CI/CD pipelines
└── docs/                    # Additional documentation
```

## ✨ Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing
- Token refresh mechanism

### Vehicle Management
- CRUD operations for vehicles
- Vehicle status tracking
- Search and filtering
- Vehicle assignment to users

### User Management
- User profile management
- Role management (Admin only)
- User activity tracking

### Reporting
- Trip statistics and analytics
- Excel export functionality
- Dashboard with key metrics

### Security Features
- Input validation and sanitization
- SQL injection prevention
- XSS protection with security headers
- CORS configuration

## 🔧 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_db
JWT_SECRET=your-jwt-secret-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=4000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:4000/api
```

### Production (.env files in deploy/)
```bash
# backend.env
DATABASE_URL=postgresql://postgres:password@postgres:5432/vehicle_db
JWT_SECRET=your-production-secret
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production

# Docker Compose environment
POSTGRES_PASSWORD=your-db-password
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=your-pgadmin-password
DOCKERHUB_USERNAME=your-username
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages

## 📞 Support

For questions or issues:
- Create GitHub Issue
- Email: support@vehiclemanagement.online

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Vehicle Management Team**
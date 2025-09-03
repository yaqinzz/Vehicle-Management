# 🚗 Vehicle Tracker Backend

Struktur proyek backend Node.js/Express dengan TypeScript yang rapi dan terorganisir menggunakan pattern MVC (Model-View-Controller).

## 📁 Struktur Proyek

```
backend/
├── src/
│   ├── app.ts                    # Konfigurasi Express app
│   ├── server.ts                 # Entry point server
│   ├── prisma.ts                 # Prisma client instance
│   │
│   ├── routes/                   # Route definitions
│   │   ├── index.ts             # Main router dengan semua routes
│   │   ├── auth.routes.ts       # Authentication routes
│   │   ├── users.routes.ts      # User management routes
│   │   ├── vehicles.routes.ts   # Vehicle routes
│   │   └── reports.routes.ts    # Report routes
│   │
│   ├── controllers/             # Business logic controllers
│   │   ├── auth.controller.ts   # Authentication controller
│   │   ├── users.controller.ts  # User management controller
│   │   ├── vehicles.controller.ts # Vehicle controller
│   │   └── reports.controller.ts  # Reports controller
│   │
│   ├── services/                # Business logic services
│   │   ├── auth.service.ts      # Authentication service
│   │   ├── users.service.ts     # User management service
│   │   ├── vehicles.service.ts  # Vehicle service
│   │   └── reports.service.ts   # Reports service
│   │
│   ├── middlewares/             # Custom middlewares
│   │   ├── auth.middleware.ts   # JWT authentication & authorization
│   │   └── error.middleware.ts  # Global error handler
│   │
│   ├── utils/                   # Utility functions
│   │   ├── jwt.ts              # JWT token utilities
│   │   ├── hash.ts             # Password hashing utilities
│   │   └── validation.ts       # Zod validation schemas
│   │
│   └── types/                   # TypeScript type definitions
│       └── express.d.ts         # Extended Express types
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
│
├── .env                         # Environment variables
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies dan scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Documentation
```

## 🎯 Fitur Utama

### 1. Authentication & Authorization

- **JWT Authentication** dengan access & refresh token
- **HTTP-only cookies** untuk keamanan
- **Role-based authorization** (admin/user)
- **Password hashing** menggunakan bcrypt

### 2. User Management (CRUD)

- Create, Read, Update, Delete users
- Role-based access control
- Data validation dengan Zod

### 3. Vehicle Management

- List semua kendaraan
- Detail kendaraan dengan riwayat perjalanan
- Status kendaraan berdasarkan tanggal

### 4. Reporting System

- **Excel export** untuk data perjalanan (.xlsx)
- **Statistics API** untuk dashboard
- Report generation menggunakan ExcelJS

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Setup environment**:

   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi database
   ```

3. **Database setup**:

   ```bash
   npm run migrate
   npm run seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication

```
POST /api/auth/login     - Login dengan email/password
POST /api/auth/refresh   - Refresh access token
POST /api/auth/logout    - Logout dan clear cookies
```

### Users (CRUD)

```
GET    /api/users        - Get all users (admin)
GET    /api/users/:id    - Get user by ID
POST   /api/users        - Create user (admin)
PUT    /api/users/:id    - Update user
DELETE /api/users/:id    - Delete user (admin)
```

### Vehicles

```
GET /api/vehicles                    - List semua kendaraan
GET /api/vehicles/:id                - Detail kendaraan
GET /api/vehicles/:id/status?date=   - Status berdasarkan tanggal
```

### Reports

```
GET /api/reports/trips/download      - Download Excel report
GET /api/reports/trips/stats         - Get statistics
```

### Health Check

```
GET /api/health                      - Server health status
```

## 🏗️ Architecture Pattern

Proyek ini menggunakan **MVC Pattern** dengan **Clean Architecture** principles:

1. **Routes** - Handle HTTP requests dan routing
2. **Controllers** - Business logic dan request/response handling
3. **Services** - Data access layer dan business operations
4. **Middlewares** - Request processing dan validation
5. **Utils** - Shared utility functions

## 🔒 Security Features

- JWT tokens dengan expiration
- HTTP-only cookies untuk token storage
- Password hashing dengan bcrypt
- Rate limiting dan CORS protection
- Input validation dengan Zod schemas

## 📝 Logging System (Winston)

- **Request/Response logging** - semua HTTP request dan response
- **Error logging** dengan stack traces
- **File-based logs** (`logs/error.log`, `logs/combined.log`)
- **Console logging** untuk development
- **Structured logging** dengan timestamps dan metadata

## 🧪 Test Accounts

```bash
# Admin Account
Email: admin@example.com
Password: admin123

# Regular User
Email: user@example.com
Password: user123
```

## ✅ Status: READY FOR PRODUCTION

Semua fitur wajib telah diimplementasi:

- ✅ JWT Authentication dengan refresh tokens
- ✅ User Management CRUD dengan role-based access
- ✅ Vehicle API dengan status tracking
- ✅ Excel Report generation (.xlsx)
- ✅ PostgreSQL dengan migrations & seeding
- ✅ Input validation dengan Zod
- ✅ Winston logging system
- ✅ Security middleware (Helmet, CORS, Rate limiting)

Struktur ini memberikan fondasi yang solid untuk pengembangan aplikasi backend yang scalable dan maintainable! 🎉

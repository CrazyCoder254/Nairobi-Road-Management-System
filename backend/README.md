# NRTMS Backend API

National Road Transport Management System - Backend API built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Vehicle Management**: CRUD operations for vehicles with document tracking
- **Driver Management**: Driver registration, license tracking, and vehicle assignment
- **SACCO Management**: Transport association management
- **Route & Terminus Management**: Route planning and terminus capacity tracking
- **Payment System**: Fee collection and payment tracking
- **Document Management**: File upload and expiry tracking
- **Security**: Rate limiting, CORS, helmet, input validation

## Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nrtms-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nrtms
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/stats` - Get vehicle statistics
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get driver by ID
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver
- `POST /api/drivers/:id/assign-vehicle` - Assign vehicle to driver

### SACCOs
- `GET /api/saccos` - Get all SACCOs
- `GET /api/saccos/:id` - Get SACCO by ID
- `GET /api/saccos/:id/vehicles` - Get SACCO vehicles
- `GET /api/saccos/:id/drivers` - Get SACCO drivers
- `POST /api/saccos` - Create new SACCO
- `PUT /api/saccos/:id` - Update SACCO
- `DELETE /api/saccos/:id` - Delete SACCO

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/stats` - Get route statistics
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes` - Create new route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

### Terminuses
- `GET /api/terminuses` - Get all terminuses
- `GET /api/terminuses/:id` - Get terminus by ID
- `GET /api/terminuses/:id/capacity` - Get terminus capacity info
- `POST /api/terminuses` - Create new terminus
- `PUT /api/terminuses/:id` - Update terminus
- `DELETE /api/terminuses/:id` - Delete terminus

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/stats` - Get payment statistics
- `GET /api/payments/overdue` - Get overdue payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `POST /api/payments/:id/process` - Process payment

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/expiring` - Get expiring documents
- `GET /api/documents/expired` - Get expired documents
- `GET /api/documents/:id` - Get document by ID
- `GET /api/documents/:id/download` - Download document
- `POST /api/documents` - Upload new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

## User Roles

- **Admin**: Full system access
- **Operator**: Can create, read, and update (no delete)
- **Viewer**: Read-only access

## File Upload

Documents are uploaded to `uploads/documents/` directory. Supported formats:
- Images: JPEG, PNG
- Documents: PDF, DOC, DOCX
- Max file size: 10MB

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- File upload restrictions

## Testing

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Set a strong JWT secret
4. Configure proper CORS origins
5. Set up SSL/TLS
6. Use PM2 or similar for process management

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name nrtms-api

# Monitor
pm2 monit
```

## Default Admin Credentials

After running the seed script:
- **Email**: admin@nrtms.com
- **Password**: admin123

**⚠️ Change these credentials immediately in production!**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
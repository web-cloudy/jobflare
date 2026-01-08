# JobFlare.ai Backend API

Backend system for JobFlare.ai platform with user registration, verification tracking, and admin dashboard.

## Features

- 🔐 **Admin Authentication** with JWT
- 👥 **User Registration** with 3-step verification process
- 📊 **Admin Dashboard** with comprehensive statistics
- ✅ **Verification Tracking** - Admin can approve/reject each step
- 🔍 **User Search & Filtering**
- 📱 **RESTful API** design

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for request validation

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/jobflare

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Admin
ADMIN_EMAIL=admin@jobflare.ai
ADMIN_PASSWORD=Admin@123456

# CORS
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB installed as service)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud database):
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update MONGODB_URI in .env

### 4. Initialize Admin Account

```bash
# Start the server first
npm run dev

# Then in another terminal, run:
curl -X POST http://localhost:5000/api/admin/initialize
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### User Registration
```http
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "profession": "Software Developer",
  "education": "Bachelor's Degree",
  "yearsOfExperience": 5,
  "country": "United States",
  "city": "New York",
  "address": "123 Main St",
  "agreeToTerms": true
}
```

#### Update Verification Step
```http
PUT /api/users/:userId/verification/:stepNumber
Content-Type: application/json

{
  "idType": "passport"  // For step 2 only
}
```

#### Get User Status
```http
GET /api/users/:userId/status
```

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@jobflare.ai",
  "password": "Admin@123456"
}
```

### Protected Admin Endpoints

All admin endpoints require `Authorization: Bearer <token>` header.

#### Dashboard Statistics
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /api/admin/users?status=pending_review&page=1&limit=20
Authorization: Bearer <token>
```

#### Search Users
```http
GET /api/admin/users/search?q=john
Authorization: Bearer <token>
```

#### Get User Details
```http
GET /api/admin/users/:userId
Authorization: Bearer <token>
```

#### Update User Verification
```http
PUT /api/admin/users/:userId/verification/:stepNumber
Authorization: Bearer <token>
Content-Type: application/json

{
  "adminChecked": true,
  "adminStatus": "approved",
  "adminNotes": "All documents verified"
}
```

## Verification Steps

### Step 1: Personal Information
- Auto-completed when user registers
- Admin reviews: name, email, profession, education, etc.
- Admin can mark as: `pending`, `approved`, `rejected`, `needs_review`

### Step 2: ID Verification
- User selects ID type (passport, driver_license, national_id)
- Admin reviews the ID selection
- Admin can approve or request changes

### Step 3: Photo Verification
- User completes photo capture
- Admin reviews photo
- Admin can approve or reject

## Admin Status Types

- `pending` - Awaiting admin review
- `approved` - Verified and approved
- `rejected` - Rejected by admin
- `needs_review` - Requires additional review

## Overall User Status

- `incomplete` - Not all steps completed
- `pending_review` - All steps completed, awaiting admin review
- `approved` - All steps approved
- `rejected` - At least one step rejected

## Project Structure

```
JobFlare-Backend/
├── controllers/
│   ├── adminController.js    # Admin logic
│   └── userController.js     # User registration logic
├── middleware/
│   └── auth.js               # JWT authentication
├── models/
│   ├── Admin.js              # Admin model
│   └── User.js               # User model with verification steps
├── routes/
│   ├── adminRoutes.js        # Admin endpoints
│   └── userRoutes.js         # User endpoints
├── .env.example              # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js                 # Application entry point
```

## Development

```bash
# Run with auto-reload
npm run dev

# Run in production
npm start
```

## Testing with cURL

### Register a user
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "profession": "Software Developer",
    "education": "Bachelor in Computer Science",
    "yearsOfExperience": 5,
    "country": "United States",
    "city": "New York",
    "agreeToTerms": true
  }'
```

### Admin login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jobflare.ai",
    "password": "Admin@123456"
  }'
```

### Get dashboard stats (replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Notes

- Change default admin credentials in production
- Use strong JWT_SECRET
- Enable HTTPS in production
- Implement rate limiting for production
- Add input sanitization
- Set up proper CORS policies

## License

ISC

# CollegeOps - College Management System

A modern, role-based college management web application built with the MERN stack.

## Project Overview

CollegeOps is a production-grade college management system designed for three types of users:
- **Admin**: Complete system control with CRUD operations for all entities
- **Teacher**: Manage courses, mark attendance, and create announcements
- **Student**: View courses, attendance records, and announcements (read-only)

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **UI Components**: shadcn/ui

## Project Structure

\`\`\`
CollegeOps/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js              # User model (Admin/Teacher/Student)
│   │   │   ├── Course.js            # Course model
│   │   │   ├── Attendance.js        # Attendance records
│   │   │   └── Announcement.js      # Announcements
│   │   ├── routes/
│   │   │   └── authRoutes.js        # Authentication routes
│   │   ├── controllers/
│   │   │   └── authController.js    # Auth logic
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT & RBAC middleware
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── utils/
│   │   │   └── generateToken.js     # JWT token generator
│   │   └── server.js                # Express server entry
│   ├── package.json
│   └── .env.example
│
├── app/                              # Next.js pages
├── components/                       # React components
└── README.md
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Create environment file**:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Configure environment variables** in `.env`:
   \`\`\`env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collegeops
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   NODE_ENV=development
   \`\`\`

5. **Start the server**:
   \`\`\`bash
   npm run dev
   \`\`\`

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies** (from root directory):
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

   The app will be available at `http://localhost:3000`

## Authentication Flow

1. **User Registration**: POST to `/api/auth/register` with user details
2. **User Login**: POST to `/api/auth/login` with email and password
3. **JWT Token**: Returned on successful login
4. **Protected Routes**: Include token in `Authorization: Bearer <token>` header
5. **Role Check**: Middleware validates user role before granting access

## Role-Based Access Control (RBAC)

### Admin Permissions
- Full CRUD operations on all entities (Users, Courses, Attendance, Announcements)
- System-wide dashboard access
- User role management

### Teacher Permissions
- Mark and edit attendance for assigned courses
- Create and update announcements
- View enrolled students
- Manage assigned courses

### Student Permissions
- View personal attendance records
- View enrolled courses
- Read announcements
- Read-only access only

## Database Models

### User Schema
- name, email, password (hashed)
- role (admin/teacher/student)
- studentId or employeeId
- department, phone
- isActive status

### Course Schema
- courseCode, courseName, department
- credits, semester
- teacher (reference to User)
- enrolledStudents (array of User references)
- description, isActive

### Attendance Schema
- course, student (references)
- date, status (present/absent/late)
- markedBy (teacher reference)
- remarks

### Announcement Schema
- title, content
- createdBy (reference to User)
- targetAudience (all/students/teachers/specific)
- targetCourses (array of Course references)
- priority (low/medium/high/urgent)
- expiresAt, isActive

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /health` - API health status

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication
- Role-based route protection
- Input validation
- Error handling middleware
- CORS enabled
- MongoDB injection prevention

## Development

- Backend runs on port 5000 (configurable)
- Frontend runs on port 3000 (Next.js default)
- Use `npm run dev` for hot-reloading during development

## Future Enhancements

- Course schedule management
- Grade management system
- Fee payment integration
- Parent portal
- Real-time notifications
- Report generation
- Mobile app

## Contributing

This is an educational project. Feel free to fork and extend functionality.

## License

MIT

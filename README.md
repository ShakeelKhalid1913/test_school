# Test School Competency Assessment Platform

A comprehensive digital competency assessment platform with a 3-step progressive evaluation system based on Test_School specifications.

## 🎯 Project Overview

The Test School platform enables users to test and certify their digital competencies through a secure, structured 3-step assessment process:

- **Step 1**: Levels A1 & A2 assessment
- **Step 2**: Levels B1 & B2 assessment  
- **Step 3**: Levels C1 & C2 assessment

### Key Features

- ✅ **3-Step Progressive Assessment Flow**
- ⏱️ **Timer System** (1 minute per question, auto-submit)
- 📚 **Question Pool** (132 questions total, 44 per step)
- 🎓 **Automatic Certification** based on scores
- 🔐 **Secure Authentication** with JWT tokens
- 📧 **Email Verification & OTP** system
- 🚫 **No retake policy** for Step 1 failures (<25%)
- 👥 **Multi-role Support** (Admin, Student, Supervisor)

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** authentication
- **Nodemailer** for email services
- **bcryptjs** for password hashing

### Frontend
- **React.js** + **TypeScript**
- **Redux Toolkit** + **RTK Query** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Redux Persist** for data persistence

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd test_school
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env file
# MongoDB URI, JWT secrets, Email configuration, etc.

# Build the TypeScript code
npm run build

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Environment Configuration

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/test_school

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Application
FRONTEND_URL=http://localhost:3000
PORT=5000
```

## 🎮 Usage

### User Registration & Authentication
1. Register with email and password
2. Verify email address via sent link
3. Login to access the platform

### Taking Assessments
1. **Step 1**: Complete A1/A2 level questions
   - Score <25%: Fail (no retake allowed)
   - Score 25-49%: A1 certified
   - Score 50-74%: A2 certified  
   - Score ≥75%: A2 certified + proceed to Step 2

2. **Step 2**: Complete B1/B2 level questions (if eligible)
   - Score <25%: Remain at A2
   - Score 25-49%: B1 certified
   - Score 50-74%: B2 certified
   - Score ≥75%: B2 certified + proceed to Step 3

3. **Step 3**: Complete C1/C2 level questions (if eligible)
   - Score <25%: Remain at B2
   - Score 25-49%: C1 certified
   - Score ≥50%: C2 certified

### Admin Functions
- Manage users and roles
- Create and manage questions
- View analytics and reports
- Monitor test sessions

## 📁 Project Structure

```
test_school/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── config/          # Configuration files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store & slices
│   │   ├── services/        # API services (RTK Query)
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
└── README.md
```

## 🎨 Design Principles

- **Simple & Clean UI**: Focus on functionality over complex design
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Follows web accessibility guidelines
- **Performance**: Optimized for fast loading and smooth interactions

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS configuration
- Helmet.js for security headers

## 📊 Assessment Scoring System

The platform uses a specific scoring system for each test step:

### Step 1 (A1/A2)
- **<25%**: Fail (no retake)
- **25-49.99%**: A1 Certificate
- **50-74.99%**: A2 Certificate
- **≥75%**: A2 Certificate + Step 2 access

### Step 2 (B1/B2)
- **<25%**: Remain at A2
- **25-49.99%**: B1 Certificate
- **50-74.99%**: B2 Certificate
- **≥75%**: B2 Certificate + Step 3 access

### Step 3 (C1/C2)
- **<25%**: Remain at B2
- **25-49.99%**: C1 Certificate
- **≥50%**: C2 Certificate

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your server
3. Set production environment variables
4. Start with: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📧 Support

For support and questions, please contact [your-email@example.com]

## 🔄 Version History

- **v1.0.0** - Initial release with core assessment functionality
- Basic 3-step assessment system
- User authentication and management
- Question management
- Certificate generation

---

**Note**: This is a basic implementation focused on core functionality as requested. The UI is kept simple and functional without unnecessary complexity.

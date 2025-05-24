# SkillSwap - A Peer-to-Peer Learning Hub

SkillSwap is a platform that connects learners and mentors for real-time and scheduled skill-sharing sessions. The app focuses on mutual learning, session bookings, and collaborative features with secure authentication and clean UI.

## App Purpose

Users can post skills they want to teach, discover skills they want to learn, request/approve sessions, and rate each other. Admins monitor platform activity.

## Tech Stack

### Frontend

- React.js with Vite (JSX only)
- Tailwind CSS for styling
- React Router DOM for routing
- Context API or useState for state management
- Formik/Yup for form validation
- Axios for API integration
- Responsive UI with Dark Mode, Skeleton loaders, and form validations

### Backend

- Node.js with Express.js
- MongoDB with Mongoose
- JWT-based Auth with bcrypt
- REST API structure with modular routes
- Multer/Cloudinary for image uploads
- Nodemailer for email notifications
- Socket.io for real-time features like chat
- Environment configs in .env

## Core Features

- Secure authentication flow (login/signup/reset)
- Role-based users: Mentor, Learner, or Both
- Skill Post creation with images, description, tags
- Skill discovery: Filter by tags, ratings, category
- Session request/approval system with calendar-like UX
- Ratings and Reviews after sessions
- User profiles with XP, past sessions, and skills offered
- Admin panel for user/post/report management
- Bookmarks and comments on skill posts
- Notifications via toast + email
- Dark mode toggle + multi-step forms for UX
- Real-time session coordination via Jitsi Meet API and Socket.io
- Visual progress tracking (e.g., sessions completed, skills learned)

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- MongoDB installed locally or MongoDB Atlas account

### Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with necessary environment variables
4. Start the server: `npm start` or `npm run dev` for development

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Deployment

- Frontend: Vercel/Netlify
- Backend: Render/Railway

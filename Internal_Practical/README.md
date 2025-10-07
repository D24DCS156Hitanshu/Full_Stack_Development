# Internal Exam - Full Stack Authentication App

A full-stack authentication application with React frontend and Node.js/Express backend.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm

## Quick Start

1. **Run the startup script:**
   ```bash
   start.bat
   ```

2. **Or manually:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   
   # Start backend (in one terminal)
   cd server
   npm start
   
   # Start frontend (in another terminal)
   npm run dev
   ```

## Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- MongoDB Integration

## Project Structure

```
exam/
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── services/        # API services
│   └── App.jsx         # Main app component
├── server/             # Node.js backend
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── server.js       # Express server
└── start.bat          # Quick start script
```
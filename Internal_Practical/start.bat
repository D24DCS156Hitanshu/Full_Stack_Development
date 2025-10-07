@echo off
echo Installing dependencies...

echo Installing frontend dependencies...
call npm install

echo Installing backend dependencies...
cd server
call npm install
cd ..

echo Starting MongoDB (make sure MongoDB is installed and running)
echo Starting backend server...
start cmd /k "cd server && npm start"

echo Starting frontend development server...
timeout /t 3 /nobreak > nul
start cmd /k "npm run dev"

echo Both servers are starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
pause
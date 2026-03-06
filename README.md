----------------Collaborative Notes App----------------

Installation

Clone Repository
cd collaborative-notes-app

----------------------------------------------
Backend Setup

Navigate to backend folder:

cd backend

Install dependencies:

npm install

Create a .env file using .env.example.

Example .env:

PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notesdb
JWT_SECRET=your_secret_key

Run backend server:

npm run dev

Backend runs on:

http://localhost:5000

-----------------------------------------------------
Frontend Setup

Open a new terminal and go to frontend folder:

cd frontend

Install dependencies:

npm install

Start frontend:

npm run dev

Frontend runs on:

http://localhost:5173

----------------------------------------------------------------------
Environment Variables

Create a .env file in the backend folder.

Variable	Description
PORT	Backend server port
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret used for signing JWT tokens

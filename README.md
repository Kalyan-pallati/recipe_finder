**Recipee Finder**
Recipe Finder is a full-stack web application that allows users to browse recipes fetched from external APIS, create their own custom recipes, and manage personal favoruites. 

This project is built for learning full stack development step by step while keeping real-world practices.

**Features:**
* Frontend (React + TailwindCSS)
* Modern landing page with clean UI
* Animated combined Login/Signup screen
* Token-based authentication using JWT
* Fully responsive layout
* React Router navigation
* Ready to integrate external recipe API
* Clean reusable components


**Backend (FastAPI + MongoDB)**
* Secure user authentication (JWT)
* Password hashing using Passlib (bcrypt)
* MongoDB database for users
* Modular architecture (auth, users, database)
* CORS configured for frontend communication
* Easily extendable for recipe storage, favorites, etc.

**Tech Stack**
* Frontend
  * React
  * TailwindCSS
  * React Router DOM
* Backend
  * FastAPI
  * MongoDB
  * python-jose (JWT)
  * Passlib(Bcrypt Hashing)
 
**To run this project, the prerequisites are:**
1. Node.js
2. Python
3. MongoDB

**Steps to run the Project:**
1. Backend
   ```bash
   cd backend
   python -m venv -venv
   ```
   **Create a virtual Environment in python to install the requirements(Windows)**
   ```bash
   .venv\Scripts\activate
   pip install -r requirements
   uvicorn app.main:app --reload --port 8000
3. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev

Frontend URL : http://localhost:5173
Go to this URL to find your website..!

**Roadmap / Future Enhancements**
1. External API Search
2. User-uploaded recipes
3. Favourite recipe bookmarking
4. Image Uploads
5. User Dashboard





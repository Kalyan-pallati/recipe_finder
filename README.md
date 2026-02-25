**Recipee Finder**
Recipe Finder is a full-stack web application that allows users to browse recipes fetched from external APIS, create their own custom recipes, manage personal favoruites, and browse community recipes(uploaded by other users) 

Users can create, edit, delete and explore recipes securely with with ownership validation. 

You can find the deployed websites in the following link:
https://recipe-finder-kappa-six.vercel.app/
## Features

### Authentication 
- JWT-based Authentication
- Secure passeword hashing
- Protected API routes 


### Recipes 
- Create custom recipes
- Edit and delete your own recipes
- Community recipe browsing
- Owner based edit/delete control
- Image upload via Cloudinary API


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

1. Clone the repository 
```bash 
git clone https://github.com/your-username/recipe-finder.git
cd recipe finder
```

2. Backend setup
- Navigate to the backend directory and create a virtual Environment
   ```bash
   cd backend
   python -m venv -venv
   ```
   **Create a virtual Environment in python to install the requirements(Windows)**
   ```bash
   .venv\Scripts\activate
   pip install -r requirements
   ```

   - Create a `.env` file in backend folder and replace the following placeholders with your APIs
   ```bash
   SPOONACULAR_API_KEY=SPOONACULAR_KEY
   CLOUDINARY_CLOUD_NAME=CLOUDINARY_NAME
   CLOUDINARY_API_KEY=API_KEY
   CLOUDINARY_API_SECRET=API_SECRET
   MONGO_URI=MONGO_CLIENT_URL
   ```
3. Frontend
- Navigate to the frontend folder, install all packages and run the project
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend URL : http://localhost:5173
Go to this URL to find your website..!

**Roadmap / Future Enhancements**
1. ~~External API Search~~
2. ~~User-uploaded recipes~~
3. ~~Favourite recipe bookmarking~~
4. ~~Image Uploads~~
5. User Dashboard
6. Adding Like and Comment feature to Community Recipes





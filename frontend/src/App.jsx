import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home.jsx'
// import Auth from './pages/Auth.jsx'
import Search from './pages/Search.jsx'
import Recipe from './pages/Recipe.jsx'
import Saved from './pages/Saved.jsx'
import MyRecipes from './pages/MyRecipes.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import MyRecipePage from './pages/MyRecipePage.jsx'
import Community from './pages/Community.jsx'
import Verify from './pages/Verify.jsx'
import MealPlanner from './pages/MealPlanner.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'

const Account = () => <div>Account Page (to be implemented)</div>;

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/my-recipe" element={<RequireAuth><MyRecipes /></RequireAuth>} />
          <Route path="/my-recipes/:id" element={<MyRecipePage />}></Route>
          <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
          <Route path="/meal-planner" element={<RequireAuth><MealPlanner /></RequireAuth>} />
          <Route path="/saved" element={ <RequireAuth><Saved /></RequireAuth>} />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="/verify" element={<Verify />}></Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />}></Route>
          {/* <Route path="/auth" element={<Auth />}></Route> */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App

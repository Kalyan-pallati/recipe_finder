import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Search from './pages/Search.jsx'
import Recipe from './pages/Recipe.jsx'
import Saved from './pages/Saved.jsx'
import MyRecipes from './pages/MyRecipes.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import MyRecipePage from './pages/MyRecipePage.jsx'
import Community from './pages/Community.jsx'

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
          <Route path="/account" element={<Account />} />
          <Route path="/saved" element={ <RequireAuth><Saved /></RequireAuth>} />
          <Route path="/recipe/:id" element={<Recipe />} />
        </Route>

        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  )
}

export default App

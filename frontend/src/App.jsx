import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Search from './pages/Search.jsx'
import Recipe from './pages/Recipe.jsx'
import Saved from './pages/Saved.jsx'

const Addrecipe = () => <div>Add Recipe Page (to be implemented)</div>;
const Community = () => <div>Community Page (to be implemented)</div>;
const Account = () => <div>Account Page (to be implemented)</div>;

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/add-recipe" element={<Addrecipe />} />
          <Route path="/community" element={<Community />} />
          <Route path="/account" element={<Account />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/recipe/:id" element={<Recipe />} />
        </Route>

        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
// import SignUp from './pages/SignUp.jsx'
import Auth from './pages/Auth.jsx'
import Search from './pages/Search.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  )
}

export default App

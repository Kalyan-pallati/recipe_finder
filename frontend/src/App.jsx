import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
// import SignUp from './pages/SignUp.jsx'
import Auth from './pages/Auth.jsx'

function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  )
}

export default App

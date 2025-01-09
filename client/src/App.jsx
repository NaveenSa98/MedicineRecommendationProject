import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Dashboard from './components/Dashboard'


function App() {
  

  return (
    <Router>
      <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/Dashboard" element={<Dashboard />} />


      </Routes>
    </Router>
    
  )
}

export default App

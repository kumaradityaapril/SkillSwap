import { Routes, Route } from 'react-router-dom';
import { login } from './services/authService';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

// Placeholder Components
const Home = () => <h1>Home Page</h1>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App

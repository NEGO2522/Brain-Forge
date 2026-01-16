import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Community from './pages/Community';
import Connect from './pages/Connect';
import About from './pages/About';
import Login from './auth/Login';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/community" element={<Community />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
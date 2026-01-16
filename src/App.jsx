import { Routes, Route, Navigate } from 'react-router-dom';
import { Fragment } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Community from './pages/Community';
import Connect from './pages/Connect';
import About from './pages/About';
import Login from './auth/Login';
import Profiles from './pages/Profiles';

// Layout component that includes the Navbar
const Layout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main >
      {children}
    </main>
  </div>
);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/community" element={
          <Layout>
            <Community />
          </Layout>
        } />
        <Route path="/connect" element={
          <Layout>
            <Connect />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Navigate to="/profiles" replace />} />
        <Route path="/profiles" element={
          <Layout>
            <Profiles />
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;
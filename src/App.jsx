import { Routes, Route, Navigate } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import Navbar, { MenuProvider, MenuContext } from './components/Navbar';
import Landing from './pages/Landing';
import Community from './pages/Community';
import Connect from './pages/Connect';
import About from './pages/About';
import Login from './auth/Login';
import Profiles from './pages/Profiles';
import User from './pages/User';
import Explore from './pages/Explore';


// Layout component that includes the Navbar
const Layout = ({ children }) => {
  const { isMenuOpen } = useContext(MenuContext);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={`transition-all duration-300 ${isMenuOpen ? 'blur-sm' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <MenuProvider>
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
        <Route path="/user" element={
          <Layout>
            <User />
          </Layout>
        } />
        <Route path="/profile" element={<Navigate to="/user" replace />} />
        <Route path="/profiles" element={
          <Layout>
            <Profiles />
          </Layout>
        } />
        <Route path="/explore" element={
          <Layout>
            <Explore />
          </Layout>
        } />
      </Routes>
      </MenuProvider>
    </div>
  );
}

export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import Navbar, { MenuProvider, MenuContext } from './components/Navbar';
import Landing from './pages/Landing';
import Connect from './pages/Connect';
import About from './pages/About';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Profiles from './pages/Profiles';
import User from './pages/User';
import Chat from './pages/Chat';
import Notification from './pages/Notification';
import Educators from './pages/Educators';
import Chats from './pages/Chats';


// Layout component that includes the Navbar
const Layout = ({ children }) => {
  const { isMenuOpen } = useContext(MenuContext);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 transition-all duration-300 ${isMenuOpen ? 'blur-sm' : ''}`}>
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
        <Route path="/signup" element={<Signup />} />
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
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/notification" element={
          <Layout>
            <Notification />
          </Layout>
        } />
        <Route path="/educators" element={
          <Layout>
            <Educators />
          </Layout>
        } />
      </Routes>
      </MenuProvider>
    </div>
  );
}

export default App;
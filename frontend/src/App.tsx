import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Status from './pages/Status';
import Admin from './pages/Admin';
import UserLogin from './pages/UserLogin';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/status/:id" element={<Status />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user-login" element={<UserLogin />} />
      </Routes>
    </Router>
  );
};

export default App;

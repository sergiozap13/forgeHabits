import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import FooterComponent from './FooterComponent';


function AppRouter() {
  return (
    
    <Router>
      <div>
        <HeaderComponent/>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route exact path="/dashboard" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
        <FooterComponent/>
      </div>
    </Router>
  );
}

export default AppRouter;
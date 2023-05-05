import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Login from './Login';
import Home from './Home';
import CoursePage from './CoursePage';
import './includes/main.css';
import 'font-awesome/css/font-awesome.min.css';


const App: React.FC = () => {
  // we should fetch when user clicked to logout className
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, '', redirect);
    }
  }, []);

  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'GET',
      redirect: 'follow'
    })
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  return (
    <div>
      <div>
        <button style={{ marginTop: '20px', marginRight:'20px' }} className="custom-btn btn-1 loginout" onClick={() => handleLogout()}>Sign out</button>
      </div>
      <Router>
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <h1 className="app-title">CourseTalk</h1>
        </NavLink>

        <div className="text-content">
          <p className="slogan">Empowering students to shape their educational journey, one review at a time</p>
          {/* make button logout */}

        </div>


        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/course/:courseName" element={<CoursePage />} />

          {/* <Route path="/classSearch" element={<CourseSearch />} /> */}
        </Routes>
      </Router>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useSelector } from 'react-redux';

function App() {
  const store = useSelector((store) => store);
  console.log(store);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const appStyle = {
    background: theme === 'light' 
      ? 'linear-gradient(to bottom, #a8d8ea, #ffffff)'  
      : 'linear-gradient(to bottom, #1e3c72, #2a69ac)', 
    color: theme === 'light' ? '#2c3e50' : '#ecf0f1', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.5s ease, color 0.5s ease', 
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div style={appStyle}>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <div className="flex">
        <Sidebar theme={theme} />
        <Outlet context={{ theme }} /> 
      </div>
    </div>
  );
}

export default App;

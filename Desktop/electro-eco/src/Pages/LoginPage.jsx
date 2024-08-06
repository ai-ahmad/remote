import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [homeId, setHomeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.mars-hackathon.uz/user/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          home_id: parseInt(homeId),
          password: password
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log('Response data:', data);

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/myhome';
      } else {
        setError('Success login');
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/myhome';
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen space-y-6 bg-gradient-to-b from-transparent to-[#353d44]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl transform transition duration-500 hover:scale-105">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="homeId" className="sr-only">Home ID</label>
              <input
                id="homeId"
                name="homeId"
                type="number"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Home ID"
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                style={{ transition: 'all 0.3s ease' }}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ transition: 'all 0.3s ease' }}
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md group hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              style={{ transition: 'background-color 0.3s ease, transform 0.3s ease' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Register
            </button>
          </div>
          <div className="flex justify-center">
            <Link to="/" className="text-sm text-pink-600 hover:text-pink-700">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

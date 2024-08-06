import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    home_owner: '',
    home_address: '',
    phone_number: '',
    password: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.mars-hackathon.uz/user/register/', formData);
      console.log(response);

      if (response.status === 201) {
        setShowToast(true);
        setErrorMessage("");

        // Save the response data to local storage
        localStorage.setItem('user', JSON.stringify(response.data));

        // Redirect to home after a delay
        setTimeout(() => {
          setShowToast(false);
          window.location.href = '/myhome';
        }, 3000);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setShowToast(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center justify-center min-h-screen space-y-6 bg-gradient-to-b from-transparent to-[#353d44]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl transform transition duration-500 hover:scale-105">
        <div className="flex justify-between items-center">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            {t("Register")}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="home_owner" className="sr-only">{t("home_owner")}</label>
              <input
                id="home_owner"
                name="home_owner"
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder={t("home_owner")}
                value={formData.home_owner}
                onChange={handleChange}
                style={{ transition: 'all 0.3s ease' }}
              />
            </div>
            <div>
              <label htmlFor="home_address" className="sr-only">{t("home_address")}</label>
              <input
                id="home_address"
                name="home_address"
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder={t("home_address")}
                value={formData.home_address}
                onChange={handleChange}
                style={{ transition: 'all 0.3s ease' }}
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="sr-only">{t("phone_number")}</label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder={t("phone_number")}
                value={formData.phone_number}
                onChange={handleChange}
                style={{ transition: 'all 0.3s ease' }}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t("password")}</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder={t("password")}
                value={formData.password}
                onChange={handleChange}
                style={{ transition: 'all 0.3s ease' }}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md group hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              style={{ transition: 'background-color 0.3s ease, transform 0.3s ease' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {t("Register")}
            </button>
          </div>
          <div className="flex justify-center">
            <Link to="/" className="text-sm text-pink-600 hover:text-pink-700">
              {t("Back to Home")}
            </Link>
          </div>
        </form>
      </div>

      {(showToast || errorMessage) && (
        <div className={`fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg transform transition duration-300 ease-in-out ${showToast ? 'bg-green-500' : 'bg-red-500'}`}>
          {showToast ? (
            <div>{t("Register successful.")}</div>
          ) : (
            <div>{errorMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

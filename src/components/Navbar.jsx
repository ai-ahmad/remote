import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import Logout from "./Logout";
import Create from './Create';
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleTheme, theme }) => {
    const navigate = useNavigate();
    const navbarStyle = theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white';
    const logoColor = theme === 'light' ? 'text-gray-900' : 'text-white';

    return (
        <div className={`navbar shadow-md px-4 py-2 ${navbarStyle}`}>
            <div className="flex-1 flex items-center">
                <a className={`btn btn-ghost text-xl font-bold ${logoColor} hover:text-blue-300 transition duration-300`}>
                    oilDrive.uz
                </a>
                <img 
                    src="https://oiltrade.uz/templates/oiltrade/images/logo1.png" 
                    alt="Логотип oilTrade" 
                    className="h-10 ml-4" 
                />
            </div>
            <div className='mr-5'>
                <Create />
            </div>
            <div className="flex items-center space-x-6">
                <Logout />
                <div onClick={toggleTheme} className="cursor-pointer ml-4 hover:text-blue-300 transition duration-300">
                    {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />} 
                </div>
            </div>
        </div>
    );
};

export default Navbar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTags, FaBullhorn, FaClipboardList, FaNewspaper, FaHome, FaBoxOpen, FaStore, FaCreditCard, FaTruck, FaAddressBook } from 'react-icons/fa';

const Sidebar = ({ theme }) => {
  const location = useLocation();
  const sidebarStyle = theme === 'light' ? 'bg-gray-100 text-black' : 'bg-gray-900 text-white';
  const linkActiveStyle = theme === 'light' ? 'bg-blue-300 text-black' : 'bg-primary text-white shadow-md';
  const linkHoverStyle = theme === 'light' ? 'hover:bg-blue-200' : 'hover:bg-primary';

  return (
    <div className={`drawer lg:drawer-open shadow-lg ${sidebarStyle} w-full lg:w-2/12`}>
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-full p-4 gap-5">
          <li>
            <Link
              to="/app/home" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/home"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaHome size={20} /> Главная страница 
            </Link>
          </li>
          <li>
            <Link
              to="/app/products" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/products"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaBoxOpen size={20} /> Продукты 
            </Link>
          </li>
          <li>
            <Link
              to="/app/applications" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/applications"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaClipboardList size={20} /> Заявки
            </Link>
          </li>
          <li>
            <Link
              to="/app/news" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/news"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaNewspaper size={20} /> Новости
            </Link>
          </li>
          <li>
            <Link
              to="/app/advertising" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/advertising"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaBullhorn size={20} /> Баннер и Реклама 
            </Link>
          </li>
          <li>
            <Link
              to="/app/otziv" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/otziv"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaBullhorn size={20} /> Отзыв
            </Link>
          </li>
          <li>
            <Link
              to="/app/magazin" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/magazin"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaStore size={20} /> Магазин
            </Link>
          </li>
          <li>
            <Link
              to="/app/oplata" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/oplata"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaCreditCard size={20} /> Оплата и заказ 
            </Link>
          </li>
          <li>
            <Link
              to="/app/dostavka" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/dostavka"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaTruck size={20} /> Доставка
            </Link>
          </li>
          <li>
            <Link
              to="/app/contacts" 
              className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
                location.pathname === "/app/contacts"
                  ? linkActiveStyle
                  : linkHoverStyle
              }`}
            >
              <FaAddressBook size={20} /> Контакты
            </Link>
          </li>

          
          <li>
  <Link
    to="/app/category" 
    className={`flex items-center gap-4 py-2 px-5 rounded-lg transition-all duration-300 ${
      location.pathname === "/app/category"
        ? linkActiveStyle
        : linkHoverStyle
    }`}
  >
    <FaTags size={20} /> Категория
  </Link>
</li>

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

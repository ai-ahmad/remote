import { useState, useEffect } from "react";
import logo from "../../assets/electro.jpg";
import scrolledLogo from "../../assets/electro.jpg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMenu } from "react-icons/fi"; // Burger icon

const HeaderComponents = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 36) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#353d44] bg-opacity-90 backdrop-filter backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-6">
          <Link to="/"><img
            src={scrolled ? scrolledLogo : logo}
            alt="Logo"
            className={`h-10 transition-all duration-300 ${
              scrolled ? "transform scale-110" : "transform scale-100"
            }`}
          /></Link>
        </div>

        <div className="relative flex gap-2 items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-300"
          >
            <FiMenu size={24} />
          </button>
          {isMobileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#1E1E20] w-40 text-white rounded-md shadow-lg z-20">
              <Link
                to="/about"
                className="block px-4 py-2 text-white w-full hover:bg-gray-700 transition duration-300"
              >
                {t("About")}
              </Link>
              <Link
                to="/calculator"
                className="block px-4 py-2 text-white w-full hover:bg-gray-700 transition duration-300"
              >
                {t("Calculator")}
              </Link>
              <Link
                to=""
                className="block px-4 py-2 text-white w-full hover:bg-gray-700 transition duration-300"
              >
                {t("Telegram bot")}
              </Link>
              <Link
                to="/developers"
                className="block px-4 py-2 text-white w-full hover:bg-gray-700 transition duration-300"
              >
                {t("Developers")}
              </Link>
              <Link
                to="/support"
                className="block px-4 py-2 text-white w-full hover:bg-gray-700 transition duration-300"
              >
                {t("Support")}
              </Link>
              <Link
                to="/myhome"
                className="block px-4 py-2 text-white w-full hover:bg-gray-700 transition duration-300"
              >
                {t("home")}
              </Link>
            </div>
          )}
          <nav className="hidden md:flex items-center space-x-7 gap-2">
            <Link
              to="/about"
              className="text-[#70c3c1] hover:text-white transition duration-300"
            >
              {t("About")}
            </Link>
            <Link
              to="/calculator"
              className="text-[#70c3c1] hover:text-white transition duration-300"
            >
              {t("Calculator")}
            </Link>
            <Link
              to=""
              className="text-[#70c3c1] hover:text-white transition duration-300"
            >
              {t("Telegram bot")}
            </Link>
            <Link
              to="/developers"
              className="text-[#70c3c1] hover:text-white transition duration-300"
            >
              {t("Developers")}
            </Link>
            <Link
              to="/support"
              className="text-[#70c3c1] hover:text-white transition duration-300"
            >
              {t("Support")}
            </Link>
            <Link
              to="/myhome"
              className="text-[#70c3c1] hover:text-white transition duration-300"
            >
              {t("home")}
            </Link>
            <a
              href="tel:+99871007007"
              className="border-bottom text-[18px] xl:text-[24px] font-bold text-[#9AAFB2] duration-300 hover:text-white transition"
            >
              <span className="ml-2 text-white">+998 78</span> 777 77 57
            </a>
          </nav>
          <select
            onChange={handleLanguageChange}
            value={i18n.language}
            className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-300"
          >
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="uz">Uzbek</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponents;

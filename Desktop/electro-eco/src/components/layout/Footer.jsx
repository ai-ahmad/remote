import React from "react";
import scrolledLogo from "../../assets/electro.jpg";

const Footer = () => {
  const handleMapButtonClick = () => {
    window.open(
      "https://yandex.uz/maps/?pt=69.286438,41.366769&z=16&l=map",
      "_blank"
    );
  };

  return (
    <footer className="mt-20 flex justify-center items-center p-5 bg-gray-800 text-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="footer-left flex items-center gap-5 mb-4 md:mb-0">
          <p className="text-center md:text-left">© Mars It School GROUP 2024</p>
          <img src={scrolledLogo} alt="Logo" className="h-10" />
        </div>
        <div className="footer-right">
          <div className="flex flex-col md:flex-row items-center bg-gray-700 rounded-lg p-3">
            <span className="text-center md:text-left">
              г.Ташкент, Yunusobod , улица Янгишахар, 10
            </span>
            <button
              className="mt-3 md:mt-0 md:ml-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              onClick={handleMapButtonClick}
            >
              На карте
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

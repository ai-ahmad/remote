import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';
import '../../config/i18'; // Make sure to import the i18n configuration

const developers = [
  {
    surname: "Abdulloh",
    name: "I.",
    age: 16,
    location: "Yunusobod",
    role: "Frontend Developer",
    img: "https://via.placeholder.com/150",
  },
  {
    name: "R.",
    surname: "Omonullo",
    age: 15,
    location: "Yunusobod",
    role: "Backend Developer",
    img: "https://via.placeholder.com/150",
  },
  {
    name: "A.",
    surname: "Ahmad",
    age: 15,
    location: "Yunusobod",
    role: "Full Stack Developer",
    img: "https://via.placeholder.com/150",
  },
  {
    name: "Y.",
    surname: "Qobil",
    age: 15,
    location: "Yunusobod",
    role: "Frontend Developer",
    img: "https://via.placeholder.com/150",
  },
  {
    name: "A.",
    surname: "Shamsiddin",
    age: 15,
    location: "Yunusobod",
    role: "Backend Developer",
    img: "https://via.placeholder.com/150",
  },
  {
    name: "M.",
    surname: "Diora",
    age: 15,
    location: "Yunusobod",
    role: "Speaker",
    img: "https://via.placeholder.com/150",
  },
];

const DeveloperList = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const { t } = useTranslation();

  return (
    <div className="container2 p-4 text-[#70c3c1]">
      <h1 className="text-4xl text-center mb-8 font-serif">
        {t("developersList")}
      </h1>
      <div className="flex flex-wrap justify-center">
        {developers.map((developer, index) => (
          <div
            key={index}
            className="w-72 h-96 overflow-hidden shadow-lg m-4 p-4 bg-[#1E1E20] rounded-md flex flex-col transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            data-aos="zoom-in"
          >
            <img
              className="w-full h-48 object-cover "
              src={developer.img}
              alt={`${developer.name} ${developer.surname}`}
            />
            <div className="px-6 py-4 flex-grow">
              <div className="font-bold text-xl mb-2 text-white">
                {developer.name} {developer.surname}
              </div>
              <p className="text-base text-[#70c3c1]">
                <span className="text-[#9AAFB2]">{t("age")}</span>:{" "}
                {developer.age}
              </p>
              <p className="text-[#70c3c1]">
                <span className="text-[#9AAFB2]">{t('location')}</span>: {developer.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperList;

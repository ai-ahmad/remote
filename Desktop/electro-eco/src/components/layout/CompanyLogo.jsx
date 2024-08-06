import React, { useEffect } from "react";
import ItPark from "../../assets/It-Park.png";
import MarsIt from "../../assets/Mars-It.png";
import Soliq from "../../assets/Soliq.png";
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Make sure to import the AOS CSS
import '../../index.css';

const CompanyLogo = () => {
  const { t } = useTranslation();

  const companies = [
    { id: 1, img: ItPark, alt: "ItPark" },
    { id: 2, img: Soliq, alt: "Soliq" },
    { id: 3, img: MarsIt, alt: "MarsIt" },
  ];

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div className="container2 text-[#70c3c1]">
      <h1 className="text-4xl text-center mb-8 font-serif text-[#70c3c1]">
        {t('companiylist')}
      </h1>
      <div className="container2 gap-[12%] flex justify-center flex-wrap ">
        {companies.map((company) => (
          <div
            key={company.id}
            data-aos="zoom-in-up"
            className="company-logo mt-3 xs:h-[66px] flex h-[127px] w-full md:w-1/3 lg:w-1/4 items-center justify-center rounded-[6px] bg-white p-[6px] transition duration-300 transform"
          >
            <img
              src={company.img}
              className="drag-none w-[130px] object-contain"
              alt={company.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyLogo;

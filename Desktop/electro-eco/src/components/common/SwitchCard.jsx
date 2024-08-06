import React from 'react';

const DeviceCard = ({ title, imgSrc, consumption, onDelete }) => {
  return (
    <div className="relative bg-gray-700 p-4 w-[250px] h-[300px] rounded-lg text-center flex flex-col items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img src={imgSrc} alt={title} className="mx-auto mb-4" style={{ height: '100px', width: '100px' }} />
      <p className="text-xl font-semibold text-white">{title}</p>
      {consumption && <div className="text-sm mt-2 text-white">Electrical energy: {consumption} KW/h</div>}
    </div>
  );
};

export default DeviceCard;

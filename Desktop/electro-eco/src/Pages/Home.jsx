import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeviceCard from '../components/common/SwitchCard'; // Ensure the import path is correct
import Header from "../components/layout/Header";
import UploadComponent from '../components/common/Uploads';

const HomePage = () => {
  const { t } = useTranslation(); // Add this line to use translation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, title: 'Temperature', value: '20', imgSrc: 'https://static.vecteezy.com/system/resources/previews/024/499/899/non_2x/electro-logo-concept-premium-design-vector.jpg', consumption: '30' },
    { id: 2, title: 'Philips lamp', value: '97', imgSrc: 'https://static.vecteezy.com/system/resources/previews/024/499/899/non_2x/electro-logo-concept-premium-design-vector.jpg', consumption: '15' },
    { id: 3, title: 'Apple TV', value: '30', imgSrc: 'https://static.vecteezy.com/system/resources/previews/024/499/899/non_2x/electro-logo-concept-premium-design-vector.jpg', consumption: '25' },
    { id: 4, title: 'HomePod', value: '', imgSrc: 'https://static.vecteezy.com/system/resources/previews/024/499/899/non_2x/electro-logo-concept-premium-design-vector.jpg', consumption: '10' },
    { id: 5, title: 'Omna', value: '', imgSrc: 'https://static.vecteezy.com/system/resources/previews/024/499/899/non_2x/electro-logo-concept-premium-design-vector.jpg', consumption: '5' },
  ]);
  const [newDevice, setNewDevice] = useState({
    title: '',
    type: '',
    consumption: '',
    imgSrc: '',
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setNewDevice({
      ...newDevice,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDevices([...devices, { ...newDevice, id: Date.now() }]);
    setNewDevice({ title: '', type: '', consumption: '', imgSrc: '' });
    closeModal();
  };

  const handleDelete = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="text-white min-h-screen p-4 mt-10">
      <Header />
      <h2 className='text-4xl text-white font-bold text-center mt-4'>{t('shikoyar')}</h2>
      <UploadComponent />
      <div className="text-center my-8">
        <h2 className="text-3xl font-semibold">{t('My Devices')}</h2>
      </div>
      <div className="container3 flex justify-center items-center w-full">
        <div className="flex flex-wrap z-[-10] gap-5 items-center">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              title={device.title}
              value={device.value}
              imgSrc={device.imgSrc}
              consumption={device.consumption}
              onDelete={() => handleDelete(device.id)}
            />
          ))}
          <div
            onClick={openModal}
            className="bg-gray-800 p-4 w-[250px] h-[300px] rounded-md text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-4xl text-white">+</span>
            <p className="text-lg font-semibold text-white mt-2">{t('Add another')}</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-md max-w-lg w-full mx-4 sm:mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl relative">
            <button
              onClick={closeModal}
              className="bg-gray-700 text-white px-4 py-2 rounded-md absolute top-2 right-2"
            >
              {t('Close')}
            </button>
            <h2 className="text-2xl mb-4 text-center">{t('Add New Device')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Device Name')}</label>
                <input
                  type="text"
                  name="title"
                  value={newDevice.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Device Type')}</label>
                <input
                  type="text"
                  name="type"
                  value={newDevice.type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Consumption (V/hr)')}</label>
                <input
                  type="number"
                  name="consumption"
                  value={newDevice.consumption}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Image URL')}</label>
                <input
                  type="text"
                  name="imgSrc"
                  value={newDevice.imgSrc}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {t('Add Device')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

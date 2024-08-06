// src/CalculatorPage.js
import React, { useState } from 'react';
import ModalTable from './Modal';

const CalculatorPage = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', power: '', hours: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = () => {
    if (newItem.name && newItem.power && newItem.hours) {
      setItems([...items, newItem]);
      setNewItem({ name: '', power: '', hours: '' });
    }
  };

  const calculateTotalCost = () => {
    const totalCost = items.reduce((acc, item) => {
      const powerConsumption = (item.power * item.hours * 30) / 1000;
      return acc + powerConsumption * 0.1; // Допустим, стоимость электроэнергии 0.1 $ за кВтч
    }, 0);
    return totalCost.toFixed(2);
  };

  return (
    <div id="calculator" className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">Рассчитайте потребление электроэнергии</h2>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Добавьте приборы</h3>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Название прибора"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border border-gray-300 px-4 py-3 rounded-lg w-full bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-300 shadow-sm"
            />
            <input
              type="number"
              placeholder="Мощность (Вт)"
              value={newItem.power}
              onChange={(e) => setNewItem({ ...newItem, power: e.target.value })}
              className="border border-gray-300 px-4 py-3 rounded-lg w-full bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-300 shadow-sm"
            />
            <input
              type="number"
              placeholder="Время работы (часы)"
              value={newItem.hours}
              onChange={(e) => setNewItem({ ...newItem, hours: e.target.value })}
              className="border border-gray-300 px-4 py-3 rounded-lg w-full bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-300 shadow-sm"
            />
            <button
              onClick={handleAddItem}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg w-full hover:from-green-500 hover:to-green-700 transition duration-300 shadow-lg"
            >
              Добавить прибор
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-lg"
          >
            Показать приборы
          </button>
          <button
            onClick={calculateTotalCost}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg mt-4 hover:from-blue-700 hover:to-blue-900 transition duration-300 shadow-lg"
          >
            Рассчитать стоимость
          </button>
          {items.length > 0 && (
            <p className="mt-6 text-3xl font-bold text-gray-900">
              Примерная стоимость за месяц: <span className="text-green-600">${calculateTotalCost()}</span>
            </p>
          )}
        </div>
      </div>
      
      {isModalOpen && <ModalTable items={items} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CalculatorPage;

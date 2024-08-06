// src/ModalTable.js
import React from 'react';

const ModalTable = ({ items, onClose }) => {
  if (!items.length) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#DB2777] bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]"> 
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Добавленные приборы</h3>
        <table className="w-full bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th className="border px-4 py-3 text-left text-xl">Название</th>
              <th className="border px-4 py-3 text-left text-xl">Мощность (Вт)</th>
              <th className="border px-4 py-3 text-left text-xl">Время ч</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors duration-300">
                <td className="border px-4 py-3">{item.name}</td>
                <td className="border px-4 py-3">{item.power}</td>
                <td className="border px-4 py-3">{item.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ModalTable;

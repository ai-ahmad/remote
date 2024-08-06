import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const reportChoices = [
  { value: 'Noqonuniy daraxt kesish', label: 'Noqonuniy daraxt kesish' },
  { value: 'Noqonuniy musur tashlash', label: 'Noqonuniy musur tashlash' },
  { value: 'Noqonuniy qurilish', label: 'Noqonuniy qurilish' },
  { value: 'Atrof-muxitni ifloslantirish', label: 'Atrof-muxitni ifloslantirish' },
];

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center animate-fadeIn"
      onDoubleClick={onClose}
    >
      <div className=" p-6 rounded-lg shadow-2xl relative z-50 max-w-lg w-full mx-4 bg-[#323B40]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const Uploads = () => {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setText('');
    setFile(null);
    setIsModalVisible(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const homeId = 1; // This should ideally come from a secure source

    if (!homeId || !selectedReport || !text || !file) {
      alert('Please ensure all fields are filled correctly.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('home', homeId);
    formData.append('report_type', selectedReport);
    formData.append('report_description', text);
    formData.append('report_file', file);

    try {
      const response = await fetch('https://api.mars-hackathon.uz/report/create/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      setIsModalVisible(false);
      alert('Report submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to submit report: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportChoices.map(choice => (
          <div
            key={choice.value}
            className="bg-[#323B41] text-white p-16  text-center text-xl font-bold rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
            onClick={() => handleReportClick(choice.value)}
          >
            {t(choice.label)}
          </div>
        ))}
      </div>
      <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <form className="p-4" onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold text-white mb-4">{t('Selected Report Type')}:</h3>
          <p className="mb-4 text-gray-300">{t(selectedReport)}</p>
          <label className="block mb-2 font-medium text-gray-300">{t('Description')}:</label>
          <textarea
            className="w-full p-3 border rounded-lg bg-gray-700 text-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            minLength={1}
            maxLength={100}
          />
          <label className="block my-4 font-medium text-gray-300">{t('Upload Image or Video')}:</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="block w-full text-gray-700 border rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            required
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              disabled={isLoading}
            >
              {isLoading ? t('Loading...') : t('Send')}
            </button>
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              onClick={() => setIsModalVisible(false)}
            >
              {t('Close')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Uploads;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaTrash, FaSpinner } from 'react-icons/fa';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhone, setSelectedPhone] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('https://admin-dash-oil-trade.onrender.com/api/v1/zayavka/');
                setApplications(response.data.data || []);
                localStorage.setItem('applications', JSON.stringify(response.data.data || []));
            } catch (error) {
                console.error('Error fetching applications:', error);
                const savedApplications = localStorage.getItem('applications');
                if (savedApplications) {
                    setApplications(JSON.parse(savedApplications));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://admin-dash-oil-trade.onrender.com/api/v1/zayavka/${id}`);
            setApplications(applications.filter((app) => app._id !== id));
            console.log('Application successfully deleted');
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const openModal = (phone) => {
        setSelectedPhone(phone);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPhone(null);
    };

    return (
        <div className=" mt-7 container mx-auto p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl min-h-screen">
            <h2 className="text-4xl font-bold text-center mb-8">Список заявок</h2>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <FaSpinner className="animate-spin text-6xl" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between border border-gray-600"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <strong className="text-2xl text-gray-200">{app.name}</strong>
                                    <span className="badge badge-info badge-outline text-sm py-1 px-3 bg-gray-600 text-gray-300">Новая заявка</span>
                                </div>

                                <div className="flex items-center mt-2">
                                    <FaEnvelope className="text-gray-400 mr-2" />
                                    <span className="text-gray-300">{app.email}</span>
                                </div>

                                <div className="flex items-center mt-2">
                                    <FaPhone className="text-gray-400 mr-2" />
                                    <span className="text-gray-300">{app.phone}</span>
                                </div>

                                <p className="text-gray-400 mt-4 italic">{app.comment}</p>
                            </div>

                            <div className="mt-6 border-t border-gray-600 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Дата: {new Date().toLocaleDateString()}</span>
                                    <div className="flex items-center">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mr-2"
                                            onClick={() => openModal(app.phone)}
                                        >
                                            Связаться
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                            onClick={() => handleDelete(app._id)}
                                        >
                                            <FaTrash className="mr-2" /> Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[400px]">
                        <h3 className="text-xl font-bold mb-4">Связаться</h3>
                        <p className="mb-4">Номер телефона: {selectedPhone}</p>
                        <div className="flex justify-between">
                            <a href={`tel:${selectedPhone}`} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                                Позвонить
                            </a>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                onClick={closeModal}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;

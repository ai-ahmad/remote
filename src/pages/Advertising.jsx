import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import LoadingComponent from '../components/LoadingComponent';

const Advertising = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        image: null,
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dataRequest = async () => {
        try {
            const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/banner');
            if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
            const ads = await response.json();
            setData(ads);
        } catch (error) {
            console.error('Error fetching advertising:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dataRequest();
    }, []);

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            alert("Пожалуйста, загрузите изображение перед отправкой.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('image', formData.image);
        formDataToSend.append('description', formData.description);

        try {
            const url = isEditing 
                ? `https://admin-dash-oil-trade.onrender.com/api/v1/banner/${currentEditId}`
                : 'https://admin-dash-oil-trade.onrender.com/api/v1/banner/create';
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка при отправке данных: ${response.status}`);
            }

            const ad = await response.json();

            setData((prevData) => {
                if (isEditing) {
                    return prevData.map((item) => (item._id === currentEditId ? ad : item));
                } else {
                    return [...prevData, ad];
                }
            });

            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Ошибка при отправке формы рекламы:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            image: null,
            description: '',
        });
        setIsEditing(false);
        setCurrentEditId(null);
    };

    const handleEdit = (ad) => {
        setIsEditing(true);
        setCurrentEditId(ad._id);
        setFormData({
            image: null,
            description: ad.description,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!id) {
            console.error("Invalid ID for deletion");
            return;
        }

        try {
            const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/banner/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error deleting advertisement');
            setData((prevData) => prevData.filter((ad) => ad._id !== id));
        } catch (error) {
            console.error('Error deleting advertisement:', error);
        }
    };

    const truncateDescription = (description) => {
        if (!description) return '';
        const words = description.split(' ');
        return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : description;
    };

    return (
        <div className="p-10 flex flex-col w-10/12 gap-5">
            <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
                <h1 className="text-2xl font-bold text-primary">Баннер Реклама</h1>
                <button
                    className="btn btn-primary flex items-center"
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add
                </button>
            </div>

            {isModalOpen && (
                <dialog open className="modal text-white">
                    <div className="modal-box">
                        <button 
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
                            onClick={() => setIsModalOpen(false)}
                        >
                            X
                        </button>
                        <form onSubmit={handleFormSubmit}>
                            <label className="input input-bordered flex items-center gap-2 mt-10">
                            изображение
                                <input type="file" name="image" onChange={handleFormChange} className="grow" />
                            </label>
                            <label className="whitespace-normal break-words input input-bordered flex items-center gap-2 mt-5">
                            Описание
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="grow whitespace-normal break-words"
                                    placeholder="Description"
                                />
                            </label>
                            <button type="submit" className="btn mt-5">
                                {isEditing ? 'Update Advertising' : 'Add Advertising'}
                            </button>
                        </form>
                    </div>
                </dialog>
            )}

            <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Изображение</th>
                                <th>Описание</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((ad) => (
                                <tr key={ad._id} className='text-white'>
                                    <td>{ad._id}</td>
                                    <td>
                                        <img src={`https://admin-dash-oil-trade.onrender.com${ad.image_url}`} alt="Ad" style={{ width: '100px', height: 'auto' }} />
                                    </td>
                                    <td>{truncateDescription(ad.description)}</td>
                                    <td>
                                        <button
                                            className="btn hover:bg-yellow-500 transition duration-200"
                                            onClick={() => handleEdit(ad)}
                                        >
                                            <FaEdit className="mr-2" /> Редактировать 
                                        </button>
                                        <button
                                            className="btn hover:bg-yellow-500 transition duration-200 ml-2"
                                            onClick={() => handleDelete(ad._id)}
                                        >
                                            <FaTrash className="mr-2" /> Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="flex justify-center mt-5">
                            <LoadingComponent />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Advertising;

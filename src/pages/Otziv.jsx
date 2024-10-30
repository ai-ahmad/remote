import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaEdit } from 'react-icons/fa';

const Otziv = () => {
    const [data, setData] = useState([]); // To store fetched reviews
    const [loading, setLoading] = useState(true); // To show loading state
    const [formData, setFormData] = useState({ // Form data for adding/editing
        name: '',
        date: '',
        rating: '',
        comment: '',
    });
    const [isEditing, setIsEditing] = useState(false); // Check if we're in edit mode
    const [currentEditId, setCurrentEditId] = useState(null); // The ID of the review being edited

    // Fetch all reviews
    const fetchOtzivs = async () => {
        try {
            const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/otziv');
            const otzivs = await response.json();
            setData(otzivs);
        } catch (error) {
            console.error('Error fetching otzivs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOtzivs();
    }, []);

    // Handle form input change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Handle form submission for adding or editing a review
    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (isEditing && currentEditId) {
                // Отправляем PUT запрос для обновления отзыва
                const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/otziv/${currentEditId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (!response.ok) {
                    throw new Error('Error updating otziv');
                }
    
                const updatedOtziv = await response.json();
                setData((prevData) =>
                    prevData.map((otziv) => (otziv._id === currentEditId ? updatedOtziv.data : otziv))
                );
            } else {
                // Отправляем POST запрос для добавления нового отзыва
                const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/otziv/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (!response.ok) {
                    throw new Error('Error adding otziv');
                }
    
                const newOtziv = await response.json();
                setData((prevData) => [...prevData, newOtziv.data]);
            }
    
            resetForm();
            document.getElementById('my_modal_otziv').close();
        } catch (error) {
            console.error('Error submitting otziv:', error);
        }
    };
    

    // Reset form and cancel edit mode
    const resetForm = () => {
        setFormData({
            name: '',
            date: '',
            rating: '',
            comment: '',
        });
        setIsEditing(false);
        setCurrentEditId(null);
    };

    // Handle edit button click to populate form with review data
    const handleEdit = (otziv) => {
        setIsEditing(true);
        setCurrentEditId(otziv._id);
        setFormData({
            name: otziv.name,
            date: otziv.date.split('T')[0], // Extract only the date portion
            rating: otziv.rating,
            comment: otziv.comment,
        });
        document.getElementById('my_modal_otziv').showModal();
    };

    // Handle delete action for reviews
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/otziv/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting otziv');
            }
            setData((prevData) => prevData.filter((otziv) => otziv._id !== id));
        } catch (error) {
            console.error('Error deleting otziv:', error);
        }
    };

    // Truncate long comments for display
    const truncateComment = (comment) => {
        if (!comment) return ''; // Return empty string if comment is undefined or null
        const words = comment.split(' ');
        return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : comment;
    };

    return (
        <div className="p-5 flex flex-col w-10/12 gap-5">
            <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
                <h1 className="text-2xl font-bold text-primary">Отзывы</h1>
                <button className="btn btn-primary flex items-center" onClick={() => { resetForm(); document.getElementById('my_modal_otziv').showModal(); }}>
                    <FaPlus className="mr-2" /> Добавить
                </button>
            </div>

            <dialog id="my_modal_otziv" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
                    </form>
                    <form onSubmit={handleFormSubmit}>
                        <label className="input input-bordered flex items-center gap-2 mt-10">
                            Имя
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="grow" placeholder="Имя" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Дата
                            <input type="date" name="date" value={formData.date} onChange={handleFormChange} className="grow" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Рейтинг
                            <input type="number" name="rating" value={formData.rating} onChange={handleFormChange} className="grow" placeholder="Рейтинг (1-5)" min="1" max="5" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Комментарий
                            <textarea name="comment" value={formData.comment} onChange={handleFormChange} className="grow bg-transparent " placeholder="Ваш комментарий" required></textarea>
                        </label>
                        <button type="submit" className="btn mt-5">
                            {isEditing ? 'Обновить Отзыв' : 'Добавить Отзыв'}
                        </button>
                    </form>
                </div>
            </dialog>

            <div className='p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl'>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Дата</th>
                                <th>Рейтинг</th>
                                <th>Комментарий</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((otziv) => (
                                <tr key={otziv._id} className='text-white'>
                                    <td>{otziv._id}</td>
                                    <td>{otziv.name}</td>
                                    <td>{new Date(otziv.date).toLocaleDateString()}</td>
                                    <td>{otziv.rating}</td>
                                    <td>{truncateComment(otziv.comment)}</td>
                                    <td>
                                        <button className="btn hover:bg-yellow-500 transition duration-200 mr-2" onClick={() => handleEdit(otziv)}>
                                            <FaEdit className="mr-2" /> Редактировать
                                        </button>
                                        <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(otziv._id)}>
                                            <FaTrash className="mr-2" /> Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="flex justify-center mt-5">
                            <FaSpinner className="animate-spin text-5xl text-gray-50" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Otziv;

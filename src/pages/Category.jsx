import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import LoadingComponent from '../components/LoadingComponent';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ category_name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/category');
            const categoryList = await response.json();
            setCategories(categoryList);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEditing && currentEditId
                ? `https://admin-dash-oil-trade.onrender.com/api/v1/category/${currentEditId}`
                : 'https://admin-dash-oil-trade.onrender.com/api/v1/category/create';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(isEditing ? 'Ошибка обновления категории' : 'Ошибка добавления категории');

            const updatedCategory = await response.json();
            setCategories((prevCategories) =>
                isEditing
                    ? prevCategories.map((category) => (category._id === currentEditId ? updatedCategory : category))
                    : [...prevCategories, updatedCategory]
            );

            resetForm();
            document.getElementById('my_modal_category').close();
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        }
    };

    const resetForm = () => {
        setFormData({ category_name: '' });
        setIsEditing(false);
        setCurrentEditId(null);
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setCurrentEditId(category._id);
        setFormData({ category_name: category.category_name });
        document.getElementById('my_modal_category').showModal();
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/category/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Ошибка удаления категории');

            setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
        } catch (error) {
            console.error('Ошибка удаления категории:', error);
        }
    };

    return (
        <div className="p-8 w-9/12 mx-auto flex flex-col gap-6">
            <div className="bg-base-200 p-6 w-full flex justify-between items-center rounded-2xl">
                <h1 className="text-2xl font-bold text-primary">Категории</h1>
                <button
                    className="btn btn-primary flex items-center"
                    onClick={() => {
                        resetForm();
                        document.getElementById('my_modal_category').showModal();
                    }}
                >
                    <FaPlus className="mr-2" /> Добавить категорию
                </button>
            </div>

            <dialog id="my_modal_category" className="modal text-white">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
                    </form>
                    <form onSubmit={handleFormSubmit}>
                        <label className="input input-bordered flex items-center gap-2 mt-10">
                            Название категории
                            <input
                                type="text"
                                name="category_name"
                                value={formData.category_name}
                                onChange={handleFormChange}
                                className="grow"
                                placeholder="Название категории"
                                required
                            />
                        </label>
                        <button type="submit" className="btn mt-5">
                            {isEditing ? 'Обновить категорию' : 'Добавить категорию'}
                        </button>
                    </form>
                </div>
            </dialog>

            <div className="p-6 w-full bg-base-200 rounded-3xl">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название категории</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        <LoadingComponent />
                                    </td>
                                </tr>
                            ) : categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category._id} className="text-white">
                                        <td>{category._id}</td>
                                        <td>{category.category_name}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning flex items-center mr-2"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <FaEdit className="mr-1" /> Редактировать
                                            </button>
                                            <button
                                                className="btn btn-danger flex items-center"
                                                onClick={() => handleDelete(category._id)}
                                            >
                                                <FaTrash className="mr-1" /> Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        Нет доступных данных
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Category;

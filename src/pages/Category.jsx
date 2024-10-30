import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaEdit } from 'react-icons/fa';

const Category = () => {
    const [categories, setCategories] = useState([]); // Список категорий
    const [loading, setLoading] = useState(true); // Статус загрузки
    const [formData, setFormData] = useState({ category_name: '' }); // Данные формы для добавления/редактирования
    const [isEditing, setIsEditing] = useState(false); // Проверка, находимся ли мы в режиме редактирования
    const [currentEditId, setCurrentEditId] = useState(null); // ID редактируемой категории

    // Загрузка всех категорий
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

    // Обработка изменения данных в форме
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Отправка формы для добавления или редактирования категории
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing && currentEditId) {
                // PUT-запрос для обновления категории
                const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/category/${currentEditId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) throw new Error('Ошибка обновления категории');

                const updatedCategory = await response.json();
                setCategories((prevCategories) =>
                    prevCategories.map((category) => category._id === currentEditId ? updatedCategory : category)
                );
            } else {
                // POST-запрос для добавления новой категории
                const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/category/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) throw new Error('Ошибка добавления категории');

                const newCategory = await response.json();
                setCategories((prevCategories) => [...prevCategories, newCategory]);
            }

            resetForm();
            document.getElementById('my_modal_category').close();
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        }
    };

    // Сброс формы и выход из режима редактирования
    const resetForm = () => {
        setFormData({ category_name: '' });
        setIsEditing(false);
        setCurrentEditId(null);
    };

    // Обработка редактирования категории
    const handleEdit = (category) => {
        setIsEditing(true);
        setCurrentEditId(category._id);
        setFormData({ category_name: category.category_name });
        document.getElementById('my_modal_category').showModal();
    };

    // Удаление категории
    const handleDelete = async (id) => {
        try {
            const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/category/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error('Ошибка удаления категории');

            setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
        } catch (error) {
            console.error('Ошибка удаления категории:', error);
        }
    };

    return (
        <div className="p-5 flex flex-col w-10/12 gap-5">
            <div className="bg-base-200 p-5 w-full flex justify-between items-center rounded-2xl">
                <h1 className="text-2xl font-bold text-primary">Категории</h1>
                <button className="btn btn-primary flex items-center" onClick={() => { resetForm(); document.getElementById('my_modal_category').showModal(); }}>
                    <FaPlus className="mr-2" /> Добавить категорию
                </button>
            </div>

            <dialog id="my_modal_category" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
                    </form>
                    <form onSubmit={handleFormSubmit}>
                        <label className="input input-bordered flex items-center gap-2 mt-10">
                            Название категории
                            <input type="text" name="category_name" value={formData.category_name} onChange={handleFormChange} className="grow" placeholder="Название категории" required />
                        </label>
                        <button type="submit" className="btn mt-5">
                            {isEditing ? 'Обновить категорию' : 'Добавить категорию'}
                        </button>
                    </form>
                </div>
            </dialog>

            <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl">
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
                            {categories.map((category) => (
                                <tr key={category._id} className="text-white">
                                    <td>{category._id}</td>
                                    <td>{category.category_name}</td>
                                    <td>
                                        <button className="btn hover:bg-yellow-500 transition duration-200 mr-2" onClick={() => handleEdit(category)}>
                                            <FaEdit className="mr-2" /> Редактировать
                                        </button>
                                        <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(category._id)}>
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

export default Category;

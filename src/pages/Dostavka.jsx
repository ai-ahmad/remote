import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import LoadingComponent from '../components/LoadingComponent';

const Dostavka = () => {
    const { theme } = useOutletContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);

    const dataRequest = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/dastavka/');
            if (!response.ok) throw new Error('Network response was not ok');
            const dostavkaData = await response.json();
            setData(dostavkaData);
        } catch (error) {
            console.error('Ошибка при загрузке данных доставки:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dataRequest();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevFormData) => ({
            ...prevFormData,
            images: files,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Initialize FormData and append fields
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formData.images.forEach((file) => {
                formDataToSend.append('images', file);
            });
    
            // Log FormData to verify it was created correctly
            console.log("FormData content:");
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }
    
            // Send the POST request to the backend
            const response = await fetch('http://localhost:5000/api/v1/dastavka/create', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    Accept: 'application/json',
                },
            });
    
            // Check if the response is not okay
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Ошибка при отправке формы: ${errorText}`);
            }
    
            // Parse the JSON response
            const result = await response.json();
            console.log('Data added successfully:', result);
            setData((prevData) => [...prevData, result.dastavka]);
    
            // Reset form and close modal
            setFormData({ name: '', description: '', images: [] });
            setIsEditing(false);
            setCurrentEditId(null);
            document.getElementById('my_modal_dostavka').close();
        } catch (error) {
            // Display detailed error message
            console.error('Ошибка при отправке формы:', error);
            alert(`Не удалось отправить форму: ${error.message}`);
    
            if (error.message.includes('NetworkError')) {
                alert("Ошибка сети: Проверьте подключение к интернету.");
            } else if (error.message.includes('404')) {
                alert("Ошибка 404: URL не найден. Проверьте правильность пути.");
            } else if (error.message.includes('500')) {
                alert("Ошибка 500: Проблема на сервере. Попробуйте позже.");
            } else {
                alert("Произошла ошибка при отправке формы. Проверьте данные и попробуйте снова.");
            }
        } finally {
            setLoading(false);
        }
    };       

    const handleEdit = (dostavkaItem) => {
        setIsEditing(true);
        setCurrentEditId(dostavkaItem._id);
        setFormData({
            name: dostavkaItem.name,
            description: dostavkaItem.description,
            images: [],
        });
        document.getElementById('my_modal_dostavka').showModal();
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/dastavka/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setData((prevData) => prevData.filter((item) => item._id !== id));
                alert('Доставка успешно удалена');
            } else {
                const errorData = await response.json();
                alert(`Не удалось удалить доставку: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Ошибка при удалении доставки:', error);
        }
    };

    const dostavkaStyle = {
        color: theme === 'light' ? '#000000' : '#ffffff',
        transition: 'color 0.5s ease',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
        gap: '1rem',
    };
    

    return (
        <div style={dostavkaStyle}>
            <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
                <h1 className="text-3xl font-bold text-primary">Доставка</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setIsEditing(false);
                        setCurrentEditId(null);
                        setFormData({ name: '', description: '', images: [] });
                        document.getElementById('my_modal_dostavka').showModal();
                    }}
                >
                    {isEditing ? 'Редактировать' : 'Добавить'}
                </button>
            </div>

            <dialog id="my_modal_dostavka" className="modal text-white">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
                    </form>
                    <form onSubmit={handleFormSubmit}>
                        <label className="input input-bordered flex items-center gap-2 mt-10">
                            Название
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="grow" placeholder="Название" required />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Изображения
                            <input type="file" name="images" onChange={handleFileChange} className="grow" multiple />
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mt-5">
                            Описание
                            <input name="description" value={formData.description} onChange={handleFormChange} className="grow" placeholder="Описание" required />
                        </label>
                        <button type="submit" className="btn mt-5">{isEditing ? 'Обновить' : 'Добавить'}</button>
                    </form>
                </div>
            </dialog>

            <div className="p-5 w-full flex justify-between items-center bg-base-300 rounded-3xl">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Изображения</th>
                                <th>Описание</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        <div className="flex justify-center items-center">
                                            <LoadingComponent />
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                Array.isArray(data) && data.length > 0 ? (
                                    data.map((dostavkaItem) => (
                                        <tr key={dostavkaItem._id} className="text-white">
                                            <td>{dostavkaItem._id}</td>
                                            <td>{dostavkaItem.name}</td>
                                            <td>
    {dostavkaItem.images && dostavkaItem.images.length > 0 ? (
        dostavkaItem.images.map((image, index) => (
            <img
                key={index}
                src={image} // Используем полный путь из API
                alt={`Изображение ${index + 1}`}
                className="w-16 h-16 object-cover"
            />
        ))
    ) : (
        <span>Без изображений</span>
    )}
</td>


                                            <td>
                                                <div className="text-sm leading-relaxed max-w-xs truncate">
                                                    {dostavkaItem.description}
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn hover:bg-yellow-200 transition duration-200" onClick={() => handleEdit(dostavkaItem)}>Редактировать</button>
                                                <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(dostavkaItem._id)}>Удалить</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Нет доступных данных</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dostavka;

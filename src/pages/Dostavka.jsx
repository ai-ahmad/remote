import React, { useEffect, useState } from 'react';
import { FaSpinner } from "react-icons/fa";

const Dostavka = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    image: '',  // Изменяем имя поля на 'image'
    name: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const dataRequest = async () => {
    try {
      const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/dastavka/');
      if (!response.ok) throw new Error('Network response was not ok');
      const dostavkaData = await response.json();
      setData(dostavkaData);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
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
      [name]: files ? files[0] : value,  // Сохраняем только первое изображение
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const url = isEditing
        ? `https://admin-dash-oil-trade.onrender.com/api/v1/dastavka/${currentEditId}`
        : 'https://admin-dash-oil-trade.onrender.com/api/v1/dastavka/create';
      const method = isEditing ? 'PUT' : 'POST';
  
      // Создание объекта FormData и добавление данных из формы
      const formDataToSend = new FormData();
      formDataToSend.append('image', formData.image);  // Изменяем 'img' на 'image'
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
  
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
  
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType.includes('application/json')) {
        const errorResponse = await response.text();
        throw new Error(`Ошибка сервера: ${errorResponse}`);
      }
  
      const result = await response.json();
  
      if (isEditing) {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === currentEditId ? result.dastavka : item
          )
        );
      } else {
        setData((prevData) => [...prevData, result.dastavka]);
      }
  
      setFormData({ image: '', name: '', description: '' });
      setIsEditing(false);
      setCurrentEditId(null);
      document.getElementById('my_modal_dostavka').close();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert(`Не удалось отправить форму: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dostavkaItem) => {
    setIsEditing(true);
    setCurrentEditId(dostavkaItem._id);
    setFormData({
      image: '',  // Оставляем изображение пустым для избежания путаницы
      name: dostavkaItem.name,
      description: dostavkaItem.description,
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
        alert('Элемент успешно удален');
      } else {
        const errorData = await response.json();
        alert(`Не удалось удалить элемент: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Ошибка при удалении элемента:', error);
    }
  };

  return (
    <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', width: '90%', gap: '1rem' }}>
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary">Доставка</h1>
        <button className="btn btn-primary" onClick={() => {
          setIsEditing(false);
          setCurrentEditId(null);
          setFormData({ image: '', name: '', description: '' });  // Изменяем img на image
          document.getElementById('my_modal_dostavka').showModal();
        }}>
          {isEditing ? 'Редактировать' : 'Добавить'}
        </button>
      </div>

      <dialog id="my_modal_dostavka" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
          </form>
          <form onSubmit={handleFormSubmit}>
            <label className="input input-bordered flex items-center gap-2 mt-10">
              Изображение 
              <input type="file" name="image" onChange={handleFormChange} className="grow" required />  {/* Изменяем 'img' на 'image' */}
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Название
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="grow" required />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Описание
              <input name="description" value={formData.description} onChange={handleFormChange} className="grow" />
            </label>
            <button type="submit" className="btn mt-5">{isEditing ? 'Обновить элемент' : 'Добавить элемент'}</button>
          </form>
        </div>
      </dialog>

      <div className='p-5 w-full flex justify-between items-center bg-base-300 rounded-3xl'>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Изображение</th>
                <th>Название</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
  {loading ? (
    <tr>
      <td colSpan="5" className="text-center flex justify-center items-center">
        <FaSpinner className="animate-spin text-5xl text-gray-50" />
      </td>
    </tr>
  ) : (
    Array.isArray(data) && data.length > 0 ? (
      data.map((dostavkaItem) => (
        <tr key={dostavkaItem._id} className='text-white'>
          <td>{dostavkaItem._id}</td>
          <td>
            <img src={`https://admin-dash-oil-trade.onrender.com/${dostavkaItem.image}`} alt={dostavkaItem.name} className="w-[100px] h-[100px] object-cover"/>
          </td>
          <td>{dostavkaItem.name}</td>
          <td>
            <div className="text-sm leading-relaxed max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
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

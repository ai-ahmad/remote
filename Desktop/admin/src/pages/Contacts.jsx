import React, { useEffect, useState } from 'react';
import { FaSpinner } from "react-icons/fa";

const Contacts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null, // Измените на null вместо строки
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const dataRequest = async () => {
    try {
      const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/contact/');
      if (!response.ok) throw new Error('Network response was not ok');
      const contactsData = await response.json();
      setData(contactsData);
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
    const { name, value, type, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'file' ? files[0] : value, 
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const url = isEditing ? `https://admin-dash-oil-trade.onrender.com/api/v1/contact/${currentEditId}` : 'https://admin-dash-oil-trade.onrender.com/api/v1/contact/create';
        const method = isEditing ? 'PUT' : 'POST';

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        if (formData.image) {
            formDataToSend.append('images', formData.image); // Измените 'image' на 'images'
        }

        const response = await fetch(url, {
            method,
            body: formDataToSend,
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Ошибка при отправке формы');
        }

        const result = await response.json();
        if (isEditing) {
            setData((prevData) => prevData.map((item) => (item._id === currentEditId ? result.contact : item)));
        } else {
            setData((prevData) => [...prevData, result.contact]);
        }

        setFormData({ name: '', description: '', image: null });
        setIsEditing(false);
        setCurrentEditId(null);
        document.getElementById('my_modal_contacts').close();
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        alert(`Не удалось отправить форму: ${error.message}`);
    } finally {
        setLoading(false);
    }
};

  const handleEdit = (contactItem) => {
    setIsEditing(true);
    setCurrentEditId(contactItem._id);
    setFormData({
      name: contactItem.name,
      description: contactItem.description,
      image: null, // Для редактирования изображение не загружается сразу
    });
    document.getElementById('my_modal_contacts').showModal();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        alert('Контакт успешно удален');
      } else {
        const errorData = await response.json();
        alert(`Не удалось удалить контакт: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Ошибка при удалении контакта:', error);
    }
  };

  const contactsStyle = {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    gap: '1rem',
  };

  return (
    <div style={contactsStyle}>
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary">Контакты</h1>
        <button className="btn btn-primary" onClick={() => {
          setIsEditing(false);
          setCurrentEditId(null);
          setFormData({ name: '', description: '', image: null }); // Установите image обратно в null
          document.getElementById('my_modal_contacts').showModal();
        }}>
          {isEditing ? 'Редактировать' : 'Добавить'}
        </button>
      </div>

      <dialog id="my_modal_contacts" className="modal">
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
              Описание
              <input name="description" value={formData.description} onChange={handleFormChange} className="grow" placeholder="Описание" />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Изображение 
              <input type="file" name="image" onChange={handleFormChange} className="grow" placeholder="URL изображения" />
            </label>
            <button type="submit" className="btn mt-5">{isEditing ? 'Обновить контакт' : 'Добавить контакт'}</button>
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
                <th>Действия</th>
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
                  data.map((contactItem) => (
                    <tr key={contactItem._id} className='text-white'>
                      <td>{contactItem._id}</td>
                      <td>
  {contactItem.images ? (
    <img 
      src={`https://admin-dash-oil-trade.onrender.com/${contactItem.images}`} 
      alt={contactItem.name} 
      className="w-[100px] h-[100px] object-cover" // Используйте object-cover для нормального отображения
    />
  ) : (
    'Нет изображения'
  )}
</td>

                      <td>{contactItem.name}</td>
                      <td>
                        <div className="text-sm leading-relaxed max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                          {contactItem.description}
                        </div>
                      </td>
                      <td>
                        <button className="btn hover:bg-yellow-200 transition duration-200" onClick={() => handleEdit(contactItem)}>Редактировать</button>
                        <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(contactItem._id)}>Удалить</button>
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

export default Contacts;

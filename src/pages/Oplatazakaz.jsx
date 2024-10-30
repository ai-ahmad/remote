import React, { useEffect, useState } from 'react';
import { FaSpinner } from "react-icons/fa";

const Oplatazakaz = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    images: [],
    name: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const dataRequest = async () => {
    try {
      const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/zakaz');
      if (!response.ok) throw new Error('Network response was not ok');
      const oplataData = await response.json();
      setData(oplataData);
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
    const { name, files, value } = e.target;
    if (name === 'images') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: Array.from(files),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
      formData.images.forEach((img) => {
        formDataToSend.append('images', img);
      });
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
  
      const url = isEditing
        ? `https://admin-dash-oil-trade.onrender.com/api/v1/zakaz/${currentEditId}`
        : 'https://admin-dash-oil-trade.onrender.com/api/v1/zakaz/create'; // Ensure this endpoint exists on your server
      const method = isEditing ? 'PUT' : 'POST';
  
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
        setData((prevData) =>
          prevData.map((item) => (item._id === currentEditId ? result.zakaz : item))
        );
      } else {
        setData((prevData) => [...prevData, result.zakaz]); // Add the new item to the data
      }
  
      setFormData({ images: [], name: '', description: '' });
      setIsEditing(false);
      setCurrentEditId(null);
      document.getElementById('my_modal_oplatazakaz').close();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert(`Не удалось отправить форму: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (oplataItem) => {
    setIsEditing(true);
    setCurrentEditId(oplataItem._id);
    setFormData({
      images: oplataItem.images || [],
      name: oplataItem.name,
      description: oplataItem.description,
    });
    document.getElementById('my_modal_oplatazakaz').showModal();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/zakaz/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((oplata) => oplata._id !== id));
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
        <h1 className="text-3xl font-bold text-primary">Оплата и заказы</h1>
        <button className="btn btn-primary" onClick={() => {
          setIsEditing(false);
          setCurrentEditId(null);
          setFormData({ images: [], name: '', description: '' });
          document.getElementById('my_modal_oplatazakaz').showModal();
        }}>
          {isEditing ? 'Редактировать' : 'Добавить'}
        </button>
      </div>

      <dialog id="my_modal_oplatazakaz" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
          </form>
          <form onSubmit={handleFormSubmit}>
            <label className="input input-bordered flex items-center gap-2 mt-10">
              Изображение
              <input type="file" name="images" multiple onChange={handleFormChange} className="grow" required />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Название
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="grow" placeholder="Название" required />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Описание
              <input name="description" value={formData.description} onChange={handleFormChange} className="grow" placeholder="Описание" />
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
                  data.map((oplataItem) => (
                    <tr key={oplataItem._id} className='text-white'>
                      <td>{oplataItem._id}</td>
                      <td>
  {oplataItem.images.map((img, index) => (
    <img key={index} src={`https://admin-dash-oil-trade.onrender.com/${img}`} alt={`Image ${index}`} className="w-[100px] h-[100px] object-cover"/>
  ))}
</td>

                      <td>{oplataItem.name}</td>
                      <td>
                        <div className="text-sm leading-relaxed max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                          {oplataItem.description}
                        </div>
                      </td>
                      <td>
                        <button className="btn hover:bg-yellow-200 transition duration-200" onClick={() => handleEdit(oplataItem)}>Редактировать</button>
                        <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(oplataItem._id)}>Удалить</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Нет данных для отображения.</td>
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

export default Oplatazakaz;

import React, { useEffect, useState } from 'react';
import { FaSpinner } from "react-icons/fa";
import { useOutletContext } from 'react-router-dom';
import LoadingComponent from '../components/LoadingComponent';

const News = () => {
  const { theme } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description1: '',
    description2: '',
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const dataRequest = async () => {
    try {
      const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/news/');
      if (!response.ok) throw new Error('Network response was not ok');
      const news = await response.json();
      setData(news);
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
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
      const newFormData = new FormData();
      newFormData.append('title', formData.title);
      newFormData.append('description1', formData.description1);
      newFormData.append('description2', formData.description2);
      newFormData.append('date', formData.date); // Include the date

      formData.images.forEach((file) => {
        newFormData.append('images', file);
      });

      const url = isEditing ? `https://admin-dash-oil-trade.onrender.com/api/v1/news/${currentEditId}` : 'https://admin-dash-oil-trade.onrender.com/api/v1/news/create';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: newFormData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Ошибка при отправке формы');
      }

      const result = await response.json();
      if (isEditing) {
        setData((prevData) => prevData.map((item) => (item._id === currentEditId ? result.news : item)));
      } else {
        setData((prevData) => [...prevData, result.news]);
      }

      setFormData({ title: '', description1: '', description2: '', date: '', images: [] });
      setIsEditing(false);
      setCurrentEditId(null);
      document.getElementById('my_modal_news').close();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert(`Не удалось отправить форму: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (newsItem) => {
    setIsEditing(true);
    setCurrentEditId(newsItem._id);
    setFormData({
      title: newsItem.title,
      description1: newsItem.description1,
      description2: newsItem.description2,
      images: [],
    });
    document.getElementById('my_modal_news').showModal();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/news/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((news) => news._id !== id));
        alert('Новость успешно удалена');
      } else {
        const errorData = await response.json();
        alert(`Не удалось удалить новость: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Ошибка при удалении новости:', error);
    }
  };

  const newsStyle = {
    color: theme === 'light' ? '#000000' : '#ffffff',
    transition: 'color 0.5s ease',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    gap: '1rem',
  };

  return (
    <div style={newsStyle}>
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary">Новости</h1>
        <button className="btn btn-primary" onClick={() => {
          setIsEditing(false);
          setCurrentEditId(null);
          setFormData({ title: '', description1: '', description2: '', images: [] });
          document.getElementById('my_modal_news').showModal();
        }}>
          {isEditing ? 'Редактировать' : 'Добавить'}
        </button>
      </div>

      <dialog id="my_modal_news" className="modal text-white">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
          </form>
          <form onSubmit={handleFormSubmit}>
            <label className="input input-bordered flex items-center gap-2 mt-10">
              Заголовок
              <input type="text" name="title" value={formData.title} onChange={handleFormChange} className="grow" placeholder="Заголовок" required />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Изображения
              <input type="file" name="images" onChange={handleFileChange} className="grow" multiple />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Описание 1
              <input name="description1" value={formData.description1} onChange={handleFormChange} className="grow" placeholder="Описание 1" />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Описание 2
              <input name="description2" value={formData.description2} onChange={handleFormChange} className="grow" placeholder="Описание 2" />
            </label>
            <button type="submit" className="btn mt-5">{isEditing ? 'Обновить новость' : 'Добавить новость'}</button>
          </form>
        </div>
      </dialog>

      <div className='p-5 w-full flex justify-between items-center bg-base-300 rounded-3xl'>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Изображения</th>
                <th>Описание 1</th>
                <th>Описание 2</th>
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
      data.map((newsItem) => (
        <tr key={newsItem._id} className='text-white'>
          <td>{newsItem._id}</td>
          <td>
            {newsItem.images && newsItem.images.length > 0 ? (
              <img src={`https://admin-dash-oil-trade.onrender.com${newsItem.images[0]}`} alt="Изображение новости" className="w-16 h-16 object-cover" />
            ) : (
              <span>Без изображения</span>
            )}
          </td>
          <td>
            <div className="text-sm leading-relaxed max-w-xs truncate">
              {newsItem.description1}
            </div>
          </td>
          <td>
            <div className="text-sm leading-relaxed max-w-xs truncate">
              {newsItem.description2}
            </div>
          </td>
          <td>
            <button className="btn hover:bg-yellow-200 transition duration-200" onClick={() => handleEdit(newsItem)}>Редактировать</button>
            <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(newsItem._id)}>Удалить</button>
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

export default News;

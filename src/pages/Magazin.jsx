import React, { useEffect, useState } from 'react';
import { FaSpinner } from "react-icons/fa";
import { useOutletContext } from 'react-router-dom';
import LoadingComponent from '../components/LoadingComponent';

const Magazin = () => {
  const { theme } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/about/');
      if (!response.ok) throw new Error('Network response was not ok');
      const magazinData = await response.json();
      setData(magazinData);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Define the URL and method based on whether we're editing or creating
    const url = isEditing
      ? `https://admin-dash-oil-trade.onrender.com/api/v1/about/update`
      : 'https://admin-dash-oil-trade.onrender.com/api/v1/about/create';
    const method = isEditing ? 'PUT' : 'POST';
    
    // Add the ID to the formData if editing
    const requestData = isEditing ? { ...formData, id: currentEditId } : formData;
  
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Ошибка при отправке формы');
      }
  
      const result = await response.json();
      console.log('Ответ сервера:', result);
  
      // Update the state based on the response
      if (isEditing) {
        setData(prevData => prevData.map(item => (item._id === currentEditId ? result.data : item)));
      } else {
        setData(prevData => [...prevData, result.data]);
      }
  
      resetForm(); // Clear the form and state
      document.getElementById('my_modal_magazin').close(); // Close the modal
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert(`Не удалось отправить форму: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const handleEdit = (magazinItem) => {
    setIsEditing(true); // Set editing mode to true
    setCurrentEditId(magazinItem._id); // Set the current editing ID
    setFormData({
      name: magazinItem.name,
      description: magazinItem.description,
    }); // Populate form with the existing data
    document.getElementById('my_modal_magazin').showModal(); // Open the modal
  };
  
  
  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      try {
        const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/about/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), // Sending the id in the request body
        });
  
        if (response.ok) {
          setData(prevData => prevData.filter(magazin => magazin._id !== id));
          alert('Элемент успешно удален');
        } else {
          const errorData = await response.json();
          alert(`Не удалось удалить элемент: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Ошибка при удалении элемента:', error);
      }
    }
  };
  

  const magazinStyle = {
    color: theme === 'light' ? '#000000' : '#ffffff',
    transition: 'color 0.5s ease',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    gap: '1rem',
  };

  return (
    <div style={magazinStyle}>
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary">Магазин</h1>
        <button className="btn btn-primary" onClick={() => {
          resetForm();
          document.getElementById('my_modal_magazin').showModal();
        }}>
          {isEditing ? 'Редактировать' : 'Добавить'}
        </button>
      </div>

      <dialog id="my_modal_magazin" className="modal text-white">
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
                <th>Название</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
  {loading ? (
    <tr>
      <td colSpan="4">
        <div className="flex justify-center items-center h-32">
          <LoadingComponent />
        </div>
      </td>
    </tr>
  ) : (
    Array.isArray(data) && data.length > 0 ? (
      data.map((magazinItem) => (
        <tr key={magazinItem._id} className='text-white'>
          <td>{magazinItem._id}</td>
          <td>{magazinItem.name}</td>
          <td>
            <div className="text-sm leading-relaxed max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
              {magazinItem.description}
            </div>
          </td>
          <td>
            <button className="btn hover:bg-yellow-200 transition duration-200" onClick={() => handleEdit(magazinItem)}>Редактировать</button>
            <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(magazinItem._id)}>Удалить</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4" className="text-center">Нет доступных данных</td>
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

export default Magazin;

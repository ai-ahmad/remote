import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSpinner } from 'react-icons/fa';
import LoadingComponent from '../components/LoadingComponent';

const Products = () => {
  const initialFormData = {
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    rating: '',
    volume: '',
    discount_price: '',
    promotion: false,
    ruler: '',
    oils_type: '',
    fidbek: '',
    image: {
      main_images: null,
      all_images: [],
    },
    pdf: null,
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFields, setImageFields] = useState([0]);
  const [mainImageIndex, setMainImageIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const handleFormChange = (e, index = null) => {
    const { name, files, type } = e.target;

    if (type === 'file' && name === 'images' && files && files[0]) {
      const updatedImages = [...formData.image.all_images];
      if (index !== null) {
        updatedImages[index] = files[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: {
            ...prevFormData.image,
            all_images: updatedImages,
          },
        }));
      }
    } else if (type === 'file' && name === 'pdf' && files && files[0]) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        pdf: files[0],
      }));
    } else if (name) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: e.target.value,
      }));
    }
  };

  const addImageField = () => {
    if (formData.image.all_images.length >= 6) {
      alert('Нельзя загрузить более 6 изображений.');
    } else {
      setImageFields((prevFields) => [...prevFields, prevFields.length]);
    }
  };

  const openImageUploadModal = () => {
    const modal = document.getElementById('image_upload_modal');
    if (modal) {
      modal.showModal();
    } else {
      console.error('Modal element not found');
    }
  };

  const handleMainImageSelection = (index) => {
    setMainImageIndex(index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: {
        ...prevFormData.image,
        main_images: formData.image.all_images[index],
      },
    }));
  };

  const closeModal = (modalId) => {
    document.getElementById(modalId).close();
    setSelectedImage(null);
    setIsEditMode(false);
    setEditProductId(null);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    document.getElementById('image_modal').showModal();
  };

  const openProductModal = (product = null) => {
    if (product) {
      setFormData({
        ...initialFormData,
        ...product,
        image: {
          main_images: product.image.main_images || null,
          all_images: product.image.all_images || [],
        },
      });
      setIsEditMode(true);
      setEditProductId(product._id);
    } else {
      setFormData(initialFormData);
      setIsEditMode(false);
      setEditProductId(null);
    }
    document.getElementById('my_modal_3').showModal();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Append regular form data fields (text fields) to FormData
    Object.keys(formData).forEach((key) => {
      if (key !== 'image' && key !== 'pdf') {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    // Append all images if any are provided
    if (formData.image.all_images.length === 0) {
      alert("Please upload at least one image.");
      return;
    } else {
      formData.image.all_images.forEach((image) => {
        formDataToSend.append('all_images', image);
      });
    }
  
    // Append main image (selected image) if exists
    if (mainImageIndex !== null && formData.image.all_images[mainImageIndex]) {
      formDataToSend.append('main_images', formData.image.all_images[mainImageIndex]);
    } else {
      alert("Please select a main image.");
      return;
    }
  
    // Append PDF if exists
    if (formData.pdf) {
      formDataToSend.append('product_info_pdf', formData.pdf);
    }
  
    try {
      // Set the correct API endpoint and HTTP method based on edit mode
      const url = isEditMode
        ? `https://admin-dash-oil-trade.onrender.com/api/v1/card/${editProductId}`
        : "http://localhost:5000/api/v1/card/create";
      const method = isEditMode ? "PUT" : "POST";
  
      // Make the request to the backend
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
  
      // Handle the server response
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server response error: ${errorText}`);
      }
  
      const result = await response.json();
  
      // Update UI based on the response
      if (isEditMode) {
        setData((prevData) =>
          prevData.map((prod) => (prod._id === editProductId ? result.product : prod))
        );
      } else {
        setData((prevData) => [...prevData, result.product]);
      }
  
      // Close the modal and reset the form
      closeModal("my_modal_3");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error saving product:", error.message);
      alert(`Error saving product: ${error.message}`);
    }
  };
  
  
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/category");
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/card/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');

      setData((prevData) => prevData.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/card");
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        setData(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col w-full gap-5">
      <button
        className="btn mb-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
        onClick={() => openProductModal()}
      >
        Добавить
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box text-white relative bg-gray-800 rounded-lg p-8">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 transition"
            onClick={() => closeModal('my_modal_3')}
          >
            ✕
          </button>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <label className="block">
                <span className="text-gray-300">Имя продукта</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Категория</span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="select w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.category_name}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-gray-300">Цена продукта</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                  min="0"
                  step="0.01"
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Запас</span>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                  min="0"
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Цена со скидкой</span>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  min="0"
                  step="0.01"
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Рейтинг</span>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                  min="0"
                  max="5"
                  step="0.1"
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Объем</span>
                <input
                  type="text"
                  name="volume"
                  value={formData.volume}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                />
              </label>

              <label className="block">
                <span className="text-gray-300">Правитель</span>
                <input
                  type="text"
                  name="ruler"
                  value={formData.ruler}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                />
              </label>

              <label className="block col-span-3">
                <span className="text-gray-300">Описание</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="textarea w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  required
                ></textarea>
              </label>

              <label className="block col-span-3">
                <span className="text-gray-300">Тип масла</span>
                <input
                  type="text"
                  name="oils_type"
                  value={formData.oils_type}
                  onChange={handleFormChange}
                  className="input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                />
              </label>

              <label className="block col-span-3">
                <span className="text-gray-300">PDF файла продукта</span>
                <input
                  type="file"
                  name="pdf"
                  onChange={handleFormChange}
                  className="file-input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                  accept=".pdf"
                  required
                />
              </label>

              <button
                type="button"
                className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
                onClick={openImageUploadModal}
              >
                Добавить изображения
              </button>

              <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg mt-4">
                {isEditMode ? "Сохранить изменения" : "Добавить продукт"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <dialog id="image_upload_modal" className="modal">
        <div className="modal-box text-white relative bg-gray-800 rounded-lg p-8">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 transition"
            onClick={() => closeModal('image_upload_modal')}
          >
            ✕
          </button>

          {imageFields.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-300">Изображение {index + 1}</label>
              <input
                type="file"
                name="images"
                onChange={(e) => handleFormChange(e, index)}
                className="file-input w-full mt-1 p-2 bg-gray-700 rounded-md text-white"
                required
              />

              {formData.image.all_images[index] && (
                <div className="flex items-center mt-2">
                  <img
                    src={URL.createObjectURL(formData.image.all_images[index])}
                    alt={`preview ${index}`}
                    className="w-32 h-32 object-cover mr-4"
                  />

                  <label className="text-gray-300 flex items-center">
                    <input
                      type="checkbox"
                      checked={mainImageIndex === index}
                      onChange={() => handleMainImageSelection(index)}
                      className="mr-2"
                    />
                    Показать в главном окне
                  </label>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mt-4"
            onClick={addImageField}
          >
            Добавить ещё изображение
          </button>
        </div>
      </dialog>

      <div className="p-5 w-full flex justify-between items-center bg-base-200 rounded-3xl">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-gray-300">Имя</th>
                <th className="text-gray-300">Изображения</th>
                <th className="text-gray-300">PDF</th>
                <th className="text-gray-300">Описание</th>
                <th className="text-gray-300">Цена</th>
                <th className="text-gray-300">Действия</th>
              </tr>
            </thead>
            <tbody className="w-full break-normal break-words">
              {data.map((product) => (
                <tr key={product._id} className="w-full text-white">
                  <td>{product.name}</td>
                  <td>
                    {product.image.all_images && product.image.all_images.length > 0 ? (
                      <img
                        src={`https://admin-dash-oil-trade.onrender.com/${product.image.all_images[0]}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover inline-block mr-2 cursor-pointer"
                        onClick={() => openImageModal(`https://admin-dash-oil-trade.onrender.com/${product.image.all_images[0]}`)}
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </td>
                  <td>
                    {product.product_info_pdf ? (
                      <a href={`https://admin-dash-oil-trade.onrender.com/${product.product_info_pdf}`} download>
                        Скачать PDF
                      </a>
                    ) : (
                      <span>No PDF Available</span>
                    )}
                  </td>
                  <td>{product.description.length > 30 ? `${product.description.substring(0, 30)}...` : product.description}</td>
                  <td>${product.price}</td>
                  <td>
                    
                    <button
                      className="btn bg-red-500 hover:bg-red-600 transition duration-200"
                      onClick={() => handleDelete(product._id)}
                    >
                      <FaTrash /> удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="image_modal" className="modal">
        <div className="modal-box relative bg-gray-800 rounded-lg p-8 text-center">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 transition"
            onClick={() => closeModal('image_modal')}
          >
            ✕
          </button>
          {selectedImage && <img src={selectedImage} alt="Selected" className="w-full h-auto object-contain" />}
        </div>
      </dialog>
    </div>
  );
};

export default Products;

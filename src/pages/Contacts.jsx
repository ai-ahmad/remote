import React, { useEffect, useState } from 'react';
import LoadingComponent from '../components/LoadingComponent';

const Contacts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [], // Array to store multiple images
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const dataRequest = async () => {
    try {
      const response = await fetch('https://admin-dash-oil-trade.onrender.com/api/v1/contact/');
      if (!response.ok) throw new Error('Network response was not ok');
      const contactsData = await response.json();

      // Check if the response is an array and contains objects with _id
      if (Array.isArray(contactsData)) {
        setData(contactsData.filter(contact => contact && contact._id)); // Filter out any undefined or invalid items
      } else {
        setData([]); // Fallback in case the response is not as expected
      }
    } catch (error) {
      console.error('Error loading data:', error);
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
        images: Array.from(files), // Convert FileList to array
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
      const url = isEditing
        ? `https://admin-dash-oil-trade.onrender.com/api/v1/contact/${currentEditId}`
        : 'https://admin-dash-oil-trade.onrender.com/api/v1/contact/create';
      const method = isEditing ? 'PUT' : 'POST';

      // Prepare FormData for submission
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error('Error Response:', errorResponse);
        throw new Error(`Form submission error: ${errorResponse}`);
      }

      const result = await response.json();
      setData((prevData) =>
        isEditing
          ? prevData.map((item) => (item._id === currentEditId ? result.contact : item))
          : [...prevData, result.contact]
      );

      // Reset form data and close modal after successful submission
      setFormData({ name: '', description: '', images: [] });
      setIsEditing(false);
      setCurrentEditId(null);
      document.getElementById('my_modal_contacts').close();
    } catch (error) {
      console.error('Form submission error:', error.message);
      alert(`Form submission failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contactItem) => {
    if (contactItem && contactItem._id) {
      setIsEditing(true);
      setCurrentEditId(contactItem._id);
      setFormData({
        name: contactItem.name,
        description: contactItem.description,
        images: [], // Clear for new selection during edit
      });
      document.getElementById('my_modal_contacts').showModal();
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://admin-dash-oil-trade.onrender.com/api/v1/contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        alert('Contact deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete contact: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', width: '90%', gap: '1rem' }}>
      <div className="bg-base-300 p-5 w-full flex justify-between items-center rounded-2xl">
        <h1 className="text-3xl font-bold text-primary">Contacts</h1>
        <button className="btn btn-primary" onClick={() => {
          setIsEditing(false);
          setCurrentEditId(null);
          setFormData({ name: '', description: '', images: [] });
          document.getElementById('my_modal_contacts').showModal();
        }}>
          Add Contact
        </button>
      </div>

      <dialog id="my_modal_contacts" className="modal text-white">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
          </form>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
            <label className="input input-bordered flex items-center gap-2 mt-10">
              Name
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="grow" placeholder="Name" required />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Description
              <input name="description" value={formData.description} onChange={handleFormChange} className="grow" placeholder="Description" />
            </label>
            <label className="input input-bordered flex items-center gap-2 mt-5">
              Images
              <input type="file" name="images" multiple onChange={handleFormChange} className="grow" placeholder="Upload images" />
            </label>
            <button type="submit" className="btn mt-5">{isEditing ? 'Update Contact' : 'Add Contact'}</button>
          </form>
        </div>
      </dialog>

      <div className="p-5 w-full flex justify-between items-center bg-base-300 rounded-3xl">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Images</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex justify-center items-center h-32">
                      <LoadingComponent />
                    </div>
                  </td>
                </tr>
              ) : Array.isArray(data) && data.length > 0 ? (
                data.map((contactItem) => (
                  contactItem && contactItem._id ? (
                    <tr key={contactItem._id} className="text-white">
                      <td>{contactItem._id}</td>
                      <td>
                        {contactItem.images && contactItem.images.length > 0 ? (
                          contactItem.images.map((images, index) => (
                            <img 
                              key={index}
                              src={`hhttps://oildrive-wtc-backend-1.onrender.com/${images}`} 
                              alt={`contact-${index}`} 
                              className="w-[100px] h-[100px] object-cover"
                            />
                          ))
                        ) : (
                          'No images'
                        )}
                      </td>
                      <td>{contactItem.name}</td>
                      <td>
                        <div className="text-sm leading-relaxed max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                          {contactItem.description}
                        </div>
                      </td>
                      <td>
                        <button className="btn hover:bg-yellow-200 transition duration-200" onClick={() => handleEdit(contactItem)}>
                          Edit
                        </button>
                        <button className="btn hover:bg-red-600 transition duration-200" onClick={() => handleDelete(contactItem._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ) : null // Prevent rendering items without an _id.
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contacts;

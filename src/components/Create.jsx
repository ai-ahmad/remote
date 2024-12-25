import React, { useState } from 'react';

const Create = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState(''); // Изменено с `name` на `username`
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUsername(''); // Очистка поля username
    setPassword('');
    setRole('');
    setError(null);
  };

  const handleCreate = async () => {
    // Basic validation
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const partnerData = { username, password, role }; 

    try {
      const response = await fetch('https://oildrive-wtc-backend-1.onrender.com/api/v1/admin/create-partnyor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error creating partner');
      }

      console.log('Partner successfully created:', result);
      closeModal(); // Закрываем модальное окно при успешном создании
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error creating partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full text-white">
      <button onClick={openModal} className="btn btn-primary text-white">
        Create Partner
      </button>

      {modalIsOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Create Partner</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block mb-2">Username:</label>
              <input
                type="text"
                value={username} // Используем `username`
                onChange={(e) => setUsername(e.target.value)} // Используем `setUsername`
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Role:</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCreate}
                className={`bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </button>

              <button
                onClick={closeModal}
                className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Create;

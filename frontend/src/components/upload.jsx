import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import '../static/css/style.css'; 

const upload = () => {
    const [showModal, setShowModal] = useState(false); 
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    const handleUpload = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const fileInput = document.querySelector('#videoUpload');
        if (!fileInput.files[0]) {
            alert('Выберите файл для загрузки.');
            return;
        }

        formData.append('video', fileInput.files[0]);
        formData.append('title', document.querySelector('#videoTitle').value);

        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post('/api/user/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Видео успешно загружено!');
                setVideos([...videos, response.data]); 
                setShowModal(false); 
            } else {
                alert('Ошибка загрузки видео');
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка при загрузке видео');
        }
    };

    return (
        <div>
            <button onClick={() => setShowModal(true)}>Загрузить видео</button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>
                            &times;
                        </span>
                        <h2>Загрузить видео</h2>
                        <form onSubmit={handleUpload}>
                            <input type="text" id="videoTitle" placeholder="Название видео" required />
                            <input type="file" id="videoUpload" accept="video/*" required />
                            <button type="submit">Загрузить</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default upload;

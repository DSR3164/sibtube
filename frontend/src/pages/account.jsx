import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import pathh from "../components/path";
import islogin from '../components/islogin';

const Account = () => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const handleWatch = (n) =>{
        navigate(`/video/${n}`)
    }
    const gomain = () => {
        navigate("/")
    }
    const handleAccount = () => {
        navigate("/account")
    }
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Вы не авторизованы!');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    alert('Вы не авторизованы!');
                    navigate('/login');
                    return;
                }
        
                // Запрос данных пользователя
                const userResponse = await axios.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(userResponse.data);
        
                // Запрос видео
                const videosResponse = await axios.get('/api/user/videos', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setVideos(videosResponse.data);
            } catch (error) {
                // Перехват различных типов ошибок
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        // Ответ от сервера с ошибкой
                        const status = error.response.status;
                        switch (status) {
                            case 401:
                                alert('Ошибка авторизации. Пожалуйста, войдите снова.');
                                navigate('/login');
                                break;
                            case 403:
                                alert('У вас недостаточно прав для выполнения этого действия.');
                                break;
                            case 404:
                                alert('Данные не найдены.');
                                break;
                            case 500:
                                alert('Ошибка сервера. Попробуйте позже.');
                                break;
                            default:
                                alert(`Ошибка: ${error.response.data.message || 'Неизвестная ошибка'}`);
                        }
                    } else if (error.request) {
                        // Ошибка сети или недоступности сервера
                        console.error('Ошибка сети:', error.request);
                        alert('Не удалось связаться с сервером. Проверьте подключение к интернету.');
                    } else {
                        // Ошибка при настройке запроса
                        console.error('Ошибка запроса:', error.message);
                        alert('Произошла ошибка при запросе данных.');
                    }
                } else {
                    // Нестандартная ошибка
                    console.error('Ошибка:', error);
                    alert('Произошла неизвестная ошибка.');
                }
            } finally {
                setLoading(false);
            }
        };        

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

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

            if (response.status == 401) {
                alert('Время авторизации вышло, пожалуйста зайдите еще раз')
            }

            if (response.status === 201) {
                alert('Видео успешно загружено!');
                setVideos([...videos, response.data]); // Обновляем список видео
                setShowModal(false); // Закрываем модальное окно
            } else {
                alert('Ошибка загрузки видео');
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Ошибка при загрузке видео');
        }
    };

    const handleDeleteVideo = async (videoId) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.delete(`/api/videos/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
            alert('Видео удалено!');
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка при удалении видео');
        }
    };

    return (
        <div className="all" style={{background: `url('${pathh}/media/image/bg.png') no-repeat`}}>
            <header className="header">
                <div className="wrapper">
                    <div className="header-wrapper">
                        <div className="header-logo">
                                <img
                                    onClick={gomain}
                                    className="header-logo-link header-logo-pic"
                                    src={`${pathh}/media/image/logo.svg`}
                                    alt="Yadro"
                                />
                        </div>
                        <nav className="header-nav">
                            <div className="header-reg">
                                {islogin ? (
                                    <img 
                                    className="logout-pic"
                                    onClick={handleLogout}
                                    src={`${pathh}/media/image/Exit.svg`}
                                    alt="Exit"/>
                                )
                                :(
                                    <img 
                                    className="logout-pic"
                                    onClick={handleLogout}
                                    src={`${pathh}/media/image/Enter.svg`}
                                    alt="Exit"/>
                                )}
                                <img
                                    className="user-pic"
                                    onClick={handleAccount}
                                    src={`${pathh}/media/image/UserCircle.svg`}
                                    alt="Registration"
                                />
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
            <main>
                <section className="user-profile">
                    <div className='user_wrapper'>
                        <p>{loading ? 'Loading...' : userData.username}</p>
                        <p>{loading ? 'Loading...' : userData.email}</p>
                    </div>
                </section>
                <section className="user-videos">
                    <div className='upload'>
                        <h2>Видео загруженные вами</h2>
                        <button  onClick={() => setShowModal(true)}>Загрузить видео</button>
                    </div>
                    <div className="video_list">
                        {videos.map((video) => (
                            <div key={video.id} 
                                onClick={() => handleWatch(video.id)}
                                className="video_item">
                                <img src={pathh+video.preview} alt="Preview" className="video_thumbnail" />
                                <div className="video_info">
                                    <p className="video_title">{video.title}</p>
                                    <p className="video_details">
                                        {video.creator} • {video.views}
                                    </p>
                                </div>
                                <button onClick={() => handleDeleteVideo(video.id)} className="delete_button">
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {showModal && (
                <div className="modal">
                    <span className="modal__close" onClick={() => setShowModal(false)}>
                        &times;
                    </span>
                    <h2 className="modal__title">Загрузить видео</h2>
                    <form className="modal__form" onSubmit={handleUpload}>
                        <input className="modal__input-text" type="text" id="videoTitle" placeholder="Название видео" required />
                        <input className="modal__input-file" type="file" id="videoUpload" accept="video/*" required />
                        <button className="modal__button" type="submit">Загрузить</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Account;

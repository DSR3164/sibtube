import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import Header from '../components/header';
import pathh from "../components/path";
import '../static/css/style.css';
const Mainn = () => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('/api/videos');

                if (!response.status == 200) {
                    throw new Error('Ошибка загрузки видео');
                }

                const videoData = await response.data;
                setVideos(videoData);
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить список видео.');
            }
        };

        fetchVideos();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const handleWatch = (n) =>{
        navigate(`/video/${n}`)
    }

    const handleAccount = () => {
        navigate("/account")
    }

    const gomain = () => {
        navigate("/")
    }
    
    return (
        <div>
            {Header()}
            <main id="main" className="main">
                <section className="all" style={{background: `url('${pathh}/media/image/bg.png') no-repeat`}}>
                    <section id="video_list" className="video_grid">
                        {videos.length > 0 ? (
                            videos.map((video) => (
                                <div key={video.id} className="video_card">
                                    <img onClick={() => handleWatch(video.id)}
                                        src={pathh + video.preview}
                                        alt={video.title}
                                        className="video_preview"
                                    />
                                    <p  className="video_text" 
                                        style={{
                                            color: `rgb(${Math.min(255, video.creator.username.length * 10)}, ${255 - Math.min(255, video.creator.username.length * 5)}, ${Math.max(0, 255 - video.creator.username.length * 15)})`
                                        }}
                                        >
                                            {video.creator.username}
                                        </p>
                                    <p>{video.title}</p>
                                </div>
                            ))
                        ) : (
                            <p>Видео пока нет.</p>
                        )}
                    </section>
                </section>
            </main>
        </div>
    );
};

export default Mainn;

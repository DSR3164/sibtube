import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VideosList() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        
        axios.get('/api/videos')
            .then(response => {
                setVideos(response.data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке видео:", error);
            });
    }, []);

    return (
        <div>
            <h1>Видео</h1>
            <ul>
                {videos.map(video => (
                    <li key={video.id}>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                        <a href={`/video/${video.id}`}>Смотреть</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VideosList;

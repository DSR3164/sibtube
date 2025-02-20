import React, { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from '../components/axios';
import pathh from "../components/path";

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`/api/videos`);
                if (response.status !== 200) {
                    throw new Error("Ошибка при загрузке данных о видео");
                }
                const videoData = response.data;
    
                const selectedVideo = videoData.find(video => video.id == id);
    
                if (!selectedVideo) {
                    throw new Error(`Видео с id ${id} не найдено`);
                }

                setVideo(selectedVideo);
    
                setComments(selectedVideo.comments || []);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };
        fetchVideo();
    }, [id]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = 0.2;
        }
    }, [video]);

    // Добавляем комментарий
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("Пользователь не авторизован");
            alert("Вы должны быть авторизованы, чтобы добавлять комментарии!");
            return;
        }
    
        try {
            const userResponse = await axios.get("/get_user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (userResponse.status == 401) {
                alert("Время вышло. Пожалуйста авторизируйтесь повторно")
                return;
            }

            const userData = userResponse.data;
            if (!userData || !userData.username) {
                console.error("Не удалось получить данные пользователя");
                alert("Ошибка авторизации. Попробуйте снова войти.");
                return;
            }
    
            const newCommentData = {
                video_id: id,
                userid: userData.id, // Используем ID авторизованного пользователя
                username: userData.username, // Ник пользователя
                text: newComment,
            };
    
            // Отправляем новый комментарий на сервер
            const response = await axios.post("/add_comment", newCommentData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Передаем токен для проверки
                },
            });
    
            if (response.data.success) {
                setComments([...comments, newCommentData]); // Обновляем список комментариев
                setNewComment(""); // Очищаем поле ввода
            } else {
                console.error("Не удалось добавить комментарий");
            }
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error);
            alert("Произошла ошибка. Попробуйте позже.");
        }
    };
    
    

    return (
        <div>
            {video ? (
                <section className="all" id={id} style={{background: `url('${pathh}/media/image/bg.png') no-repeat`}}>
                    <div className="video_wrapper">
                        <div className="video_controls">
                            <video
                                ref={videoRef}
                                id="Player"
                                src={`${pathh + video.url}`}
                                className="viewer"
                                controls
                                poster={`${pathh}/media/image/bg2.png`}
                            />
                            <Link to="/" className="turn_back">
                                <img src={`${pathh}/media/image/arrow_left.svg`} alt="Back" />
                            </Link>
                        </div>
                        <div className="comments_wrapper">
                            <p className="chat_header">Комментарии</p>
                            <div id="chat" className="chat">
                                {comments.map((comment, index) => (
                                    <div key={index} className="comm_card">
                                        <p className="user_nickname">{comment.username}</p>
                                        <p>{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="input_wrapper">
                                <input
                                    type="text"
                                    name="user_comment"
                                    id="input"
                                    className="chat_textfield"
                                    placeholder="Write comments here"
                                    maxLength="150"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button 
                                onClick={handleAddComment}
                                className="sender">
                                    Send
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <p>Загрузка видео...</p>
            )}
        </div>
    );
};

export default VideoPlayer;

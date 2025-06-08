import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import pathh from "../components/path";
import Header from '../components/header';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const handleAccount = () => {
        navigate("/account")
    }
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            alert("Вы уже авторизированны");
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const gomain = () => {
        navigate("/")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = response.data;
    
            if (response.status === 201) {
                alert('Регистрация успешна!');
                navigate('/login');
            } else {
                alert(`Ошибка: ${data.error}`);
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Произошла ошибка. Попробуйте еще раз.');
        }
    };
    

    return (
        <div>
            {Header()}
            <main>
                <section className="all" style={{background: `url('${pathh}/media/image/bg.png') no-repeat`}}>
                    <div className="form-reg">
                        <div className="reg-header">
                            <div className="reg-header-wrapper">
                                <p>Registration</p>
                                <div className="under" id="a"></div>
                            </div>
                        </div>
                        <form className="form" onSubmit={handleSubmit}>
                            <ul className="user-data">
                                <li className="data-item">
                                    <p className="name-data">Email</p>
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="authin"
                                            placeholder="Your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </li>
                                <li className="data-item">
                                    <p className="name-data">Username</p>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            name="username"
                                            required
                                            className="authin"
                                            placeholder="Your username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </li>
                                <li className="data-item">
                                    <p className="name-data">Password</p>
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            className="authin"
                                            placeholder="Your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </li>
                            </ul>
                            <div className="submit">
                                <button type="submit" className="send-button">
                                    Sign up
                                </button>
                                <p className="have-no-acc">
                                    Already have an account?{' '}
                                    <a className="links" href="/login">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Register;

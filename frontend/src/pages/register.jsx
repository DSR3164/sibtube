import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import pathh from "../components/path";
import islogin from '../components/islogin';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        nickname: '',
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
            const response = await axios.post('/register', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = response.data;

            if (response.status == 201) {
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
                                    <p className="name-data">Nickname</p>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            name="nickname"
                                            required
                                            className="authin"
                                            placeholder="Your nickname"
                                            value={formData.nickname}
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

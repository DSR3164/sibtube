import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../components/axios';
import pathh from "../components/path";
import islogin from '../components/islogin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const gomain = () => {
        navigate("/")
    }
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/login', {
                email,
                password,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            const data = response.data;
        
            if (response.status === 200) {
                localStorage.setItem('access_token', data.access_token);
                navigate('/');
            } else {
                alert(`Ошибка: ${data.error}`);
            }
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            alert('Произошла ошибка. Попробуйте снова.');
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
            <main className="main">
                <section className="all" style={{background: `url('${pathh}/media/image/bg.png') no-repeat`}}>
                    <div className="form-reg">
                        <div className="reg-header">
                            <div className="reg-header-wrapper">
                                <p>Authentication</p>
                                <div className="under" id="a"></div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="form">
                            <div>
                                <div className="data-item">
                                    <label className="name-data" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="authin"
                                        placeholder="Your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="data-item">
                                    <label className="name-data" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        className="authin"
                                        placeholder="Your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="submit">
                                <button type="submit" className="send-button" id="ba">
                                    Sign in
                                </button>
                                <p className="have-no-acc">
                                    Don't have an account?{' '}
                                    <a className="links" href="/register">
                                        Sign up
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

export default Login;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import islogin from '../components/islogin';
import pathh from './path';
const Header = () =>{
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('access_token');
    };

    const handleLogin = () => {
        navigate("/login")
    }

    const handleAccount = () => {
        navigate("/account")
    }

    const gomain = () => {
        navigate("/")
    }

    return (
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
                                    className="login-pic"
                                    onClick={handleLogin}
                                    src={`${pathh}/media/image/Enter.svg`}
                                    alt="Enter"/>
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
    );
}
export default Header
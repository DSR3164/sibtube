import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import islogin from '../components/islogin';
const Header = () =>{
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

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
                                    src="http://localhost:5000/get_pic/logo.svg"
                                    alt="Yadro"
                                />
                        </div>
                        <nav className="header-nav">
                            <div className="header-reg">
                                {islogin ? (
                                    <img 
                                    className="logout-pic"
                                    onClick={handleLogout}
                                    src="http://localhost:5000/get_pic/Exit.svg"
                                    alt="Exit"/>
                                )
                                :(
                                    <img 
                                    className="logout-pic"
                                    onClick={handleLogout}
                                    src="http://localhost:5000/get_pic/Enter.svg"
                                    alt="Exit"/>
                                )}
                                <img
                                    className="user-pic"
                                    onClick={handleAccount}
                                    src="http://localhost:5000/get_pic/UserCircle.svg"
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
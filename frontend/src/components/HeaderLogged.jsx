import React from 'react';
import logoText from '../assets/logo-text.svg';

const HeaderLogged = () => {
    const handleLogout = () => {
        if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            sessionStorage.removeItem('jwtToken');
            window.location.href = '/login';
        }
    };

    return (
        <header className="bg-gradient-to-r from-orange-600 to-orange-300 bg-opacity-95 text-white shadow-lg">
            <div className="container mx-auto flex items-center justify-between h-24">
                <button>
                    <a href="/dashboard">
                        <img src={logoText.src} alt="ForgeHabits" className="object-cover h-20 w-52" />
                    </a>
                </button>
                <nav className="font-semibold text-base lg:text-lg flex items-center">
                    <ul className="flex items-center">
                        <li className="p-5 xl:p-8 active">
                            <a href="/dashboard" className="hover:text-gray-700 transition-colors duration-200">
                                <span>Inicio</span>
                            </a>
                        </li>
                        <li className="p-5 xl:p-8">
                            <a href="/habits" className="hover:text-gray-700 transition-colors duration-200">
                                <span>Hábitos</span>
                            </a>
                        </li>
                        <li className="p-5 xl:p-8">
                            <a href="/calendar" className="hover:text-gray-700 transition-colors duration-200">
                                <span>Calendario</span>
                            </a>
                        </li>
                        <li className="p-5 xl:p-8">
                            <a href="/diary" className="hover:text-gray-700 transition-colors duration-200">
                                <span>Diario</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="flex px-2 mt-3">
                    <a href="/profile">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-11 h-11 hover:text-gray-700 transition-colors duration-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </a>
                    <button onClick={handleLogout} id="logoutButton" className="border border-white rounded-full font-bold px-8 py-1 ml-2 hover:text-gray-700 hover:bg-gradient-to-r from-orange-500 to-orange-400 hover:border-gray-700 transition-colors duration-200" >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default HeaderLogged;

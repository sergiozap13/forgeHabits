import React, { useState } from 'react';
import logoText from '../assets/logo-text.svg';

const HeaderLogged = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('jwtToken');
        window.location.href = '/login';
    };

    return (
        <header className="bg-gradient-to-r from-orange-600 to-orange-300 bg-opacity-95 text-white shadow-lg relative">
            <div className="container mx-auto flex items-center justify-between h-24">
                <button>
                    <a href="/dashboard">
                        <img src={logoText.src} alt="ForgeHabits" className="object-cover h-20 w-52" />
                    </a>
                </button>
                <div className="flex items-center justify-center flex-1">
                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                            </svg>
                        </button>
                    </div>
                    <nav className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative right-1/2 lg:right-auto transform lg:transform-none translate-x-1/2 lg:translate-x-0 mt-100 lg:mt-0 bg-orange-600 lg:bg-transparent shadow-md lg:shadow-none w-48 lg:w-auto rounded-lg lg:rounded-none font-semibold text-base lg:text-lg`}>
                        <ul className="flex flex-col lg:flex-row lg:items-center text-black lg:text-white">
                            <li className="p-5 xl:p-8">
                                <a href="/dashboard" className="hover:text-gray-700 transition-colors duration-200">
                                    Inicio
                                </a>
                            </li>
                            <li className="p-5 xl:p-8">
                                <a href="/habits" className="hover:text-gray-700 transition-colors duration-200">
                                    Hábitos
                                </a>
                            </li>
                            <li className="p-5 xl:p-8">
                                <a href="/calendar" className="hover:text-gray-700 transition-colors duration-200">
                                    Calendario
                                </a>
                            </li>
                            <li className="p-5 xl:p-8">
                                <a href="/diary" className="hover:text-gray-700 transition-colors duration-200">
                                    Diario
                                </a>
                            </li>
                            <li className="p-5 lg:hidden">
                                <a href="/profile" className="hover:text-gray-700 transition-colors duration-200">
                                    Perfil
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <button onClick={handleLogout} id="logoutButton" className="border border-white rounded-full font-bold px-8 py-1 ml-12 mb-2 hover:text-gray-700 hover:bg-gradient-to-r from-orange-500 to-orange-400 hover:border-gray-700 transition-colors duration-200" >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default HeaderLogged;

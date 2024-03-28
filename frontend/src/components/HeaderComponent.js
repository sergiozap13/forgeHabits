import React, { useState } from "react";
import logoText from "../assets/logo-text.svg";
import { Link } from "react-router-dom";


export default function HeaderComponent() {
    const [isLoggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
      };
  
    return (
      <header className="bg-gradient-to-r from-orange-500 to-orange-300 bg-opacity-95 text-white shadow-lg hidden md:block">
        <div className="container mx-auto flex items-center justify-between h-24">
            <div className="mt-3 animate-fade animate-once animate-duration-800" >
              <Link to='/'>
                <img src={logoText} alt="ForgeHabits" width="200" height="100"  />
              </Link>
              
            </div>
          <nav className="font-semibold text-base lg:text-lg flex items-center">
          <ul className="flex items-center">
            {isLoggedIn && (
              <>
                <li className="p-5 xl:p-8 active">
                  <a href="/" className="hover:text-gray-600 transition-colors duration-200">
                    <span>Inicio</span>
                  </a>
                </li>
                <li className="p-5 xl:p-8">
                  <a href="/habits" className="hover:text-gray-600 transition-colors duration-200">
                    <span>Hábitos</span>
                  </a>
                </li>
                <li className="p-5 xl:p-8">
                  <a href="/calendar" className="hover:text-gray-600 transition-colors duration-200">
                    <span>Calendario</span>
                  </a>
                </li>
                <li className="p-5 xl:p-8">
                  <a href="/diary" className="hover:text-gray-600 transition-colors duration-200">
                    <span>Diario</span>
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
        {isLoggedIn ? (
          <div className="px-2 mt-3">
            <a href="/login">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-11 h-11 hover:text-gray-600 transition-colors duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="p-5 xl:p-8">
            <Link onClick={handleLogin} to="/login" className="border border-white rounded-full font-bold px-8 py-1 hover:text-gray-600 hover:bg-gradient-to-r from-orange-500 to-orange-400">Iniciar Sesión</Link>
          </div>
        )}
        </div>
      </header>
    );
}

// LoginForm.js
import React from 'react';
import { Link } from 'react-router-dom';


function LoginFormComponent() {
  return (
    <>
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg px-8 py-6 mb-4">
        <h1 className="font-bold text-xl mb-4 text-center">Login</h1>
                <div className="w-full max-w-xs">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Usuario
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Usuario" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Contraseña
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Link to="/" className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 ml-10 rounded focus:outline-none focus:shadow-outline" type="button">
                        Iniciar Sesión
                        </Link>
                    </div>
                    </form>
                </div>
        </div>
    </div>
    </>
    
  );
}

export default LoginFormComponent;

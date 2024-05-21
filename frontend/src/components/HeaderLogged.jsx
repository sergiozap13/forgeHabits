import logoText from '../assets/logo-text.svg';
import Tooltip from './tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';

const HeaderLogged = () => {
    const handleLogout = () => {
        sessionStorage.removeItem('jwtToken');
        window.location.href = '/login';
    };

    return (
        <header className="bg-gradient-to-r from-orange-300 to-orange-200 bg-opacity-95 text-white shadow-lg relative">
            <div className="container mx-auto flex items-center justify-between h-24">
                <a href="/dashboard">
                    <img src={logoText.src} alt="ForgeHabits" className="object-cover h-20 w-52 mt-3" />
                </a>

                <div className="flex items-center justify-center flex-1">
                    <nav className="hidden md:flex absolute md:relative right-1/2 md:right-auto transform md:transform-none translate-x-1/2 md:translate-x-0 mt-100 md:mt-0 bg-orange-600 md:bg-transparent shadow-md md:shadow-none w-48 md:w-auto rounded-lg md:rounded-none font-semibold text-base md:text-lg">
                        <ul className="flex flex-col text-md md:flex-row md:items-center text-black">
                            <li className="p-5 xl:p-8">
                                <a href="/dashboard" className="text-xl hover:text-gray-700 transition-colors duration-200">Inicio</a>
                            </li>
                            <li className="p-5 xl:p-8">
                                <a href="/myhabits" className="hover:text-gray-700 transition-colors duration-200">Hábitos</a>
                            </li>
                            <li className="p-5 xl:p-8">
                                <a href="/calendar" className="hover:text-gray-700 transition-colors duration-200">Calendario</a>
                            </li>
                            <li className="p-5 xl:p-8">
                                <a href="/diary" className="hover:text-gray-700 transition-colors duration-200">Diario</a>
                            </li>
                            
                        </ul>
                    </nav>
                    <div className='hidden md:flex mx-20'>
                        <a href="/profile" className="">
                            <span class="material-symbols-outlined px-2 py-1 ml-5 text-black text-4xl hover:text-gray-700 hover:scale-110 transition-all duration-200 ">
                                account_circle
                            </span>
                        </a>

                        <Tooltip content="Cerrar sesión" placement='right'>
                            <button onClick={handleLogout} className="px-2 py-1 border border-black rounded-xl ml-5 text-red-700 font-bold hover:bg-orange-300 hover:border-gray-800 transition-colors duration-200 hover:scale-105">
                                <span className="material-symbols-outlined mt-1">logout</span>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-gradient-to-r from-orange-300 to-orange-200 text-gray-800 shadow-lg py-1">
                <div className="flex justify-around text-center items-center">
                    <a href="/dashboard" className="flex flex-col items-center justify-center p-2 rounded-xl shadow transition duration-300 ease-in-out hover:bg-orange-500 hover:shadow-md">
                        <span className="material-symbols-outlined text-xl">home</span>
                        Inicio
                    </a>
                    <a href="/myhabits" className="flex flex-col items-center justify-center p-2 rounded-xl shadow transition duration-300 ease-in-out hover:bg-orange-400 hover:shadow-md">
                        <span className="material-symbols-outlined text-xl">auto_stories</span>
                        Hábitos
                    </a>
                    <a href="/calendar" className="flex flex-col items-center justify-center p-2 rounded-xl shadow transition duration-300 ease-in-out hover:bg-orange-400 hover:shadow-md">
                        <span className="material-symbols-outlined text-xl">event</span>
                        Calendario
                    </a>
                    <a href="/diary" className="flex flex-col items-center justify-center p-2 rounded-xl shadow transition duration-300 ease-in-out hover:bg-orange-400 hover:shadow-md">
                        <span className="material-symbols-outlined text-xl">book</span>
                        Diario
                    </a>
                    <button onClick={handleLogout} className="flex flex-col items-center justify-center p-2 rounded-xl shadow transition duration-300 ease-in-out hover:bg-orange-400 hover:shadow-md">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Salir
                    </button>
                </div>
            </div>


        </header>
    );
}

export default HeaderLogged;

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { set } from "date-fns";

function LoginForm(){
    // estados para el login per se
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // para la animación
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const loginForm = async (event) => {
        event.preventDefault()  
        setLoading(true); // activamos la animación
        setError(''); // limpiamos errores

        if (!email || !password) {
            setError('Por favor, rellena todos los campos.');
            setLoading(false);
            return;
        }   

        const data = { email, password };
    
        try{
            const response = await fetch('http://localhost:3000/api/auth/login' , {
                method: 'POST',
                headers: {
                    'Content-Type' : "application/json",
                }, 
                body: JSON.stringify(data),
            })
            
            const responseData = await response.json()

            if(response.ok){
                // si la respuesta es un 200, guardamos el JWT en sesión
                sessionStorage.setItem('jwtToken', responseData.token)
                // Redirección
                window.location.href = '/dashboard';
            } else if(response.status === 401 && responseData.message === 'Password incorrect'){
                setError('La contraseña no es correcta')
            } else if (response.status === 401 && responseData.message === 'No user with that email'){
                setError('No existe un usuario con ese email')
            } else {
                setError('Ocurrió un error, por favor intentalo de nuevo en unos minutos')
            }
        }catch(error){
            console.error('Hubo un error ', error)
            setError('Hubo un problema con la conexión. Inténtalo de nuevo más tarde.');

        } finally{ 
            setLoading(false)
        }
    }

    if(loading){
        return <LoadingSpinner/>
    }

    return (
        <div className="bg-gray-300 shadow-2xl rounded-2xl p-4 sm:p-6 mb-6 lg:w-96 animate-jump-in animate-duration-400">
            <form onSubmit={loginForm} className="bg-gray-200 rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 mt-5">
                <div className="mb-4 sm:mb-6">
                    <label className="block text-gray-700 text-base sm:text-lg font-bold mb-2 sm:mb-3" htmlFor="email">
                        Usuario
                    </label>
                    <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="username" type="text" placeholder="Usuario" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-6 sm:mb-8">
                    <label className="block text-gray-700 text-base sm:text-lg font-bold mb-2 sm:mb-3" htmlFor="password">
                        Contraseña
                    </label>
                    <input className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-300 bg-gray-900 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="password" type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="flex items-center justify-center">   
                        {error && (
                            <p className="flex items-center text-red-600 text-base sm:text-lg italic">
                                <span className="material-symbols-outlined text-md mr-2">
                                    error
                                </span> 
                                {error}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between space-y-4 sm:space-y-6">
                    <button type="submit" className="bg-orange-200 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2">
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </div>





    )
}

export default LoginForm


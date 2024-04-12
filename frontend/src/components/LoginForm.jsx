import { useState } from "react";
import { login } from "../stores/userStore";
import LoadingSpinner from "./LoadingSpinner";

function LoginForm(){
    // estados para el login per se
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // para la animación
    const [loading, setLoading] = useState(false);

    const loginForm = async (event) => {
        event.preventDefault()  
        setLoading(true); // activamos la animación
        const data = {
            email, password
        }
    
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
                login()
                // Redirección
                window.location.href = '/dashboard';
            } else if(response.status === 401 && responseData.message === 'Password incorrect'){
                alert('La contraseña no es correcta')
            } else if (response.status === 401 && responseData.message === 'No user with that email'){
                alert('El usuario no existe')
            }
        }catch(error){
            console.error('Hubo un error ', error)
        } finally{ 
            setLoading(false)
        }
    }

    if(loading){
        return <LoadingSpinner/>
    }

    return (
        <div className="bg-white shadow-xl rounded-xl px-8 py-6 mb-4 max-w-lg animate-jump-in animate-duration-400">
            <h1 className="font-bold text-xl mb-4 text-center text-black">Login</h1>
            <form onSubmit={loginForm} className="bg-gray-200 rounded-xl shadow-xl px-8 pt-6 pb-8 mb-3">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Usuario
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="username" type="text" placeholder="Usuario" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="password" type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex flex-col items-center justify-between space-y-4">
                    <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 ml-5 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2">
                        Iniciar Sesión
                    </button>

                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-8 rounded-xl shadow focus:outline-none focus:shadow-outline w-full max-w-md">
                        <img src="https://www.material-tailwind.com/logos/logo-google.png" alt="Google logo" className="w-5 h-5" />
                        Inicia sesión con Google
                    </button>
                </div>
            </form>
            <div className="text-center">
                <a href="/register" className="text-orange-500 hover:text-orange-400 mb-2 text-sm">¿Aún no tienes cuenta? Regístrate aquí</a>
                <br/>
            </div>
        </div>
    )
}

export default LoginForm


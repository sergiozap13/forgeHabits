import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

function RegisterForm() {
    // Estados para el registro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [last_name, setlast_name] = useState('');
    const [phone, setPhone] = useState('');  // Campo opcional
    const [prefix, setPrefix] = useState('');  // Campo opcional
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        console.log('Hola')
        setLoading(true);  // Activamos la animación

        if (password !== passwordConfirm) {
            alert('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        const fullPhone = prefix ? `${prefix}${phone}` : phone;

        const data = {
            email,
            name,
            last_name,
            password,
            phone: fullPhone,
            username,
        };
    
        try {
            const response = await fetch('http://localhost:3000/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                }, 
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if (response.ok) {
                sessionStorage.setItem('jwtToken', responseData.token);
                window.location.href = '/dashboard'; 
            } else {
                if(response.status === 400 && responseData.message === "Email already exists") {
                    alert('El email ya está registrado');
                } else if(response.status === 400 && responseData.message === "Username already exists"){
                    alert('El nombre de usuario ya está registrado');
                } else {
                    alert('Ocurrió un error al registrar el usuario');
                }
            }
        } catch (error) {
            console.error('Hubo un error', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-white shadow-xl rounded-xl px-8 py-6 mb-4 max-w-xl animate-jump-in animate-duration-400">
            <h1 className="font-bold text-xl mb-4 text-center text-black">Registro</h1>
            <form onSubmit={handleRegister} className="bg-gray-200 rounded-xl shadow-xl px-8 pt-6 pb-8 mb-3">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nombre
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="name" type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                        Apellidos
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="last_name" type="text" placeholder="Apellidos" value={last_name} onChange={(e) => setlast_name(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Nombre de usuario
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="username" type="text" placeholder="Apellidos" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prefix">
                        Prefijo Teléfono
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="prefix" type="text" placeholder="Prefijo teléfono" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                        Teléfono
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="phone" type="text" placeholder="Número de teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="password" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirm">
                        Confirmar Contraseña
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="passwordConfirm" type="password" placeholder="Repite tu contraseña" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>
                <div className="flex flex-col items-center justify-between space-y-4">
                    <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline">
                        Registrarse
                    </button>

                    <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-8 rounded-xl shadow focus:outline-none focus:shadow-outline w-full max-w-md">
                        <img src="https://www.material-tailwind.com/logos/logo-google.png" alt="Google logo" className="w-5 h-5" />
                        Regístrate con Google
                    </button>
                </div>
            </form>
            <div className="text-center">
                <a href="/login" className="text-orange-500 hover:text-orange-400 text-sm">¿Ya tienes cuenta? Inicia sesión aquí</a>
            </div>
        </div>
    );
}

export default RegisterForm;

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

function RegisterForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [prefix, setPrefix] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorStep1, setErrorStep1] = useState('');
    const [errorStep2, setErrorStep2] = useState('');

    const countryCodes = [
        { country: "España", code: "+34" },
        { country: "México", code: "+52" },
        { country: "Argentina", code: "+54" },
        { country: "Colombia", code: "+57" },
        { country: "Chile", code: "+56" },
        { country: "Perú", code: "+51" },
        { country: "Estados Unidos", code: "+1" },
        { country: "Reino Unido", code: "+44" },
        { country: "Francia", code: "+33" },
        { country: "Alemania", code: "+49" },
    ];

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (password !== passwordConfirm) {
            setErrorStep2('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }


        const fullPhone = prefix ? `${prefix}${phone}` : phone;
        console.log(fullPhone);

        const data = {
            email,
            name,
            last_name,
            password,
            phone: fullPhone,
            username,
        };
    
        try {
            const response = await fetch('https://forge-habits.vercel.app/api/users/create', {
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
                    setErrorStep1('El email ya está registrado');
                    prevStep();
                } else if(response.status === 400 && responseData.message === "Username already exists"){
                    setErrorStep1('El nombre de usuario ya está registrado');
                    prevStep();
                } else if(response.status === 400 && responseData.message === "Phone already exists"){
                    setErrorStep2('El teléfono ya está registrado');
                } else {
                    setErrorStep2('Ocurrió un error, por favor intentalo de nuevo en unos minutos');
                }
            }
        } catch (error) {
            console.error('Hubo un error', error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-white shadow-xl rounded-xl px-4 py-6 mb-4 max-w-xl animate-jump-in animate-duration-400 mt-5 m-1">
        <h1 className="font-bold text-xl mb-4 text-center text-black">Registro</h1>
        {step === 1 && (
            <form className="bg-gray-200 rounded-xl shadow-xl px-6 pt-6 pb-8 mb-3">
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
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="last_name" type="text" placeholder="Apellidos" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Nombre de usuario
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" id="username" type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="flex items-center justify-center m-3">   
                    {errorStep1 && (
                        <p className="flex items-center text-red-600 text-base sm:text-lg italic">
                            <span className="material-symbols-outlined text-md mr-2">
                                error
                            </span> 
                            {errorStep1}
                        </p>
                    )}
                </div>
                <div className="flex justify-center">
                    <button type="button" onClick={nextStep} className="bg-orange-200 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2">
                        Siguiente
                    </button>
                </div>
            </form>
        )}
        {step === 2 && (
            <form onSubmit={handleRegister} className="bg-gray-200 rounded-xl shadow-xl px-6 pt-6 pb-8 mb-3">
                <div className="flex flex-col sm:flex-row mb-4">
                    <div className="sm:w-2/4 sm:mr-2 mb-4 sm:mb-0">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prefix">
                            Prefijo
                        </label>
                        <select 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" 
                            id="prefix" 
                            value={prefix} 
                            onChange={(e) => setPrefix(e.target.value)}
                        >
                            <option value="" disabled>Selecc. un prefijo</option>
                            {countryCodes.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.country} ({country.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:w-2/4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Teléfono
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 bg-gray-900 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2" 
                            id="phone" 
                            type="text" 
                            placeholder="Número de teléfono" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                        />
                    </div>
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
                <div className="flex items-center justify-center m-3">   
                    {errorStep2 && (
                        <p className="flex items-center text-red-600 text-base sm:text-lg italic">
                            <span className="material-symbols-outlined text-md mr-2">
                                error
                            </span> 
                            {errorStep2}
                        </p>
                    )}
                </div>
                <div className="flex justify-between space-x-2">
                    <button type="button" onClick={prevStep} className="bg-gray-500 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline">
                        Anterior
                    </button>
                    <button type="submit" className="bg-orange-200 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2">
                        Registrarse
                    </button>
                </div>
            </form>
        )}
    </div>
    


    );
}

export default RegisterForm;

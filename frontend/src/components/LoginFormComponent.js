// LoginForm.js
import React, {useState} from 'react';


function LoginFormComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
          email: email,
          password: password
        };
        console.log(data)
        try {
          const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
      
          if (response.ok) { // si es es 200 hace algo
            // TODO: Aqui se deberia cambiar el isLoggedIn a true
            const responseData = await response.json();
            console.log(responseData);
          } else {
            console.log(response.error)
          }
        } catch (error) {
          console.error('Hubo un error al enviar la solicitud:', error);
        }
      };
  return (
    <>
      <div className="bg-gradient-to-r from-gray-600 to-gray-300 h-screen flex justify-center items-center">
        
            <div className="bg-white shadow-xl rounded-xl px-8 py-6 mb-4 max-w-xs animate-jump-in animate-duration-400">
                <h1 className="font-bold text-xl mb-4 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="bg-gray-200 rounded-xl shadow-xl px-8 pt-6 pb-8 mb-3">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Usuario
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Usuario" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 ml-7 rounded-xl focus:outline-none focus:shadow-outline">
                            Iniciar Sesión
                        </button>
                    </div>
                </form>

                <div className="text-center">
                  <a href="/register" className="text-orange-500 hover:text-orange-400 mb-2 text-sm">¿Aún no tienes cuenta?</a>
                  <br/>
                  <button className="bg-orange-500 hover:bg-orange-400 text-white py-2 px-3 ml- rounded-xl focus:outline-none focus:shadow-outline">
                      Registrate
                  </button>
                </div>
            </div>
        </div>
    </>
    
  );
}

export default LoginFormComponent;

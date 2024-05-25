import { useState } from 'react';

const ContactComponent = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        setSubmitted(true);
    };

    return (
        <div className="container mx-auto p-4 animate-fade-right">
            <div className="bg-gray-300 shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl text-gray-700 text-center font-semibold mb-2">Envíanos un correo</h2>
                {submitted ? (
                    <p className="text-green-500">¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                Mensaje
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                id="message"
                                placeholder="Tu mensaje"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-orange-200 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2"
                                type="submit"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="bg-gray-300 shadow-md rounded-lg p-6 text-center">
                <h2 className="text-gray-700 text-2xl font-semibold mb-2">Sobre Nosotros</h2>
                <p className="text-black">
                    Esta página está creada como proyecto de fin de grado de Ingeniería Informática en la Universidad de Granada. 
                </p>
            </div>
        </div>
    );
};

export default ContactComponent;

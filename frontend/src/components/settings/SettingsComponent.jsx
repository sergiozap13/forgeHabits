import { useState, useEffect } from 'react';
import Tooltip from '../../components/tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';

const SettingsComponent = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmUsername, setConfirmUsername] = useState('');
    const [message, setMessage] = useState('');
    const [accountMessage, setAccountMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    const token = sessionStorage.getItem('jwtToken');

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
  
            if (!response.ok) throw new Error('Network response was not ok');
            const userInfoData = await response.json();
            setUserInfo(userInfoData);
        } catch (error) {
            console.error("Error updating completion:", error);
        }
    }

    const updatePassword = async () => {
        const response = await fetch(`http://localhost:3000/api/users/changepass`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setMessage('Contraseña cambiada con éxito');

            setTimeout(() => {
                sessionStorage.removeItem('jwtToken');
                window.location.href = '/login';
            }, 1000);
        } else {
            if(response.status === 400 && data.message === 'Incorrect current password') {
                setMessage('Contraseña actual incorrecta');
            }
        }

    }

    const deleteUser = async () => {
        const response = await fetch(`http://localhost:3000/api/users/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.ok) {
            setUsername('');
            setConfirmUsername('');
            setAccountMessage('Cuenta eliminada con éxito');

            setTimeout(() => {
                sessionStorage.removeItem('jwtToken');
                window.location.href = '/login';
            }, 1000);
        } else {
            if(response.status === 500) {
                setAccountMessage('Error al eliminar la cuenta');
            }
        }

    }


    const handlePasswordChange = () => {
        if (newPassword === confirmPassword) {
            updatePassword();
        } else {
            setMessage('Las nuevas contraseñas no coinciden');
        }
    };

    const handleAccountDeletion = () => {
        if (confirmUsername === username) {
            deleteUser();
            setAccountMessage('Cuenta eliminada con éxito');
        } else {
            setAccountMessage('El nombre de usuario no coincide');
        }
    };

    useEffect(() => {   
        fetchUserInfo();
    }, []);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-700 p-10'>
            <div className='w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg space-y-10'>
                <div className='settings-item'>
                        <div className="flex flex-col items-start p-6 rounded-lg bg-orange-50 shadow-md">
                            <div className="flex items-center justify-center p-4 rounded-full bg-orange-200 text-white mb-4 shadow-lg">
                                <span className="material-symbols-outlined text-4xl">
                                    password
                                </span>
                            </div>
                            <div className="w-full">
                                <span className="block text-lg font-semibold text-orange-500 mb-2 text-center">Cambiar contraseña</span>
                                <p className="text-sm text-gray-700 mb-4 text-center">
                                    Cambia tu contraseña periódicamente para mantener tu cuenta segura.
                                </p>
                                <div className="space-y-4 w-full">
                                    <input
                                        type="password"
                                        placeholder="Contraseña actual"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirmar nueva contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button
                                        onClick={handlePasswordChange}
                                        className="mt-4 w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-orange-300 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Guardar nueva contraseña
                                    </button>
                                    {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
                                </div>
                            </div>
                        </div>
                </div>
                <div className='settings-item'>
                    <Tooltip content="Eliminar cuenta">
                        <div className="flex flex-col items-start p-6 rounded-lg bg-orange-50 shadow-md">
                            <div className="flex items-center justify-center p-4 rounded-full bg-orange-200 text-white mb-4 shadow-lg">
                                <span className="material-symbols-outlined text-4xl">
                                    delete_forever
                                </span>
                            </div>
                            <div className="w-full">
                                <span className="block text-lg font-semibold text-orange-500 mb-2 text-center">Eliminar cuenta de @{userInfo?.username}</span>
                                <p className="text-sm text-gray-700 mb-4 text-center">
                                    Si decides que ya no quieres usar nuestra plataforma, escribe tu nombre de usuario para confirmar y elimina tu cuenta aquí.
                                </p>
                                <input
                                    type="text"
                                    placeholder="Nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Confirma tu nombre de usuario"
                                    value={confirmUsername}
                                    onChange={(e) => setConfirmUsername(e.target.value)}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <button
                                    onClick={handleAccountDeletion}
                                    className="mt-4 w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Eliminar cuenta de @{userInfo?.username}
                                </button>
                                {accountMessage && <p className="mt-2 text-sm text-green-600">{accountMessage}</p>}
                            </div>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export default SettingsComponent;

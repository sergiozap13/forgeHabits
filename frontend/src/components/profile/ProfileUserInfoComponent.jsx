import React, { useEffect, useState } from 'react';
import ProfileStatsComponent from './ProfileStatsComponent.jsx';
import ProfileSettingsButtons from './ProfileSettingsButtons.jsx';

const ProfileUserInfoComponent = () => {
    const [userInfo, setUserInfo] = useState(null);
    const token = sessionStorage.getItem('jwtToken');

    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState({ name: ''});

    const handleEditClick = () => {
        if (isEditing) {
            updateUserInfo();
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUserInfo({
            ...editedUserInfo,
            [name]: value
        });
    };

    const maskEmail = (email) => {
        if (!email) return '';
        const [localPart, domainPart] = email.split('@');
        const maskedLocalPart = localPart.charAt(0) + '***';
        const domainName = domainPart.split('.')[0];
        const domainExtension = domainPart.split('.').slice(1).join('.');
        const maskedDomain = '****';
        return `${maskedLocalPart}@${maskedDomain}.${domainExtension}`;
    };

    const maskPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '';
    
        const isValidPhoneNumber = /^\+\d{10,}$/.test(phoneNumber);
        if (!isValidPhoneNumber) {
            return '*'; 
        }
    
        const countryCode = phoneNumber.slice(0, phoneNumber.length - 10);
        const localNumber = phoneNumber.slice(phoneNumber.length - 10);
    
        const maskedLocalNumber = localNumber.slice(0, 2) + '******' + localNumber.slice(-2);
        
        return `${countryCode}${maskedLocalNumber}`;
    };
    
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

    const updateUserInfo = async () => {
        console.log(editedUserInfo);
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userInfo?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }, 
                body: JSON.stringify(editedUserInfo)
            });
  
            if (!response.ok) throw new Error('Network response was not ok');
            const userInfoData = await response.json();
            setUserInfo(userInfoData.updatedUser);

        } catch (error) {
            console.error("Error updating completion:", error);
        }
    }


    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <div className="container mx-auto my-10 p-5 bg-gray-700 shadow-2xl rounded-xl">
            <div className='flex items-center justify-between'>
                <h1 className='text-4xl font-bold text-white m-3'>
                    Perfil de <span className='text-orange-300'>{userInfo?.name}</span>
                </h1>
                <div className='flex-shrink-0 ml-auto'>
                    <ProfileSettingsButtons />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-center">
                <div className="w-full md:w-1/3 mb-10 md:mb-0 border-2 border-gray-300 rounded-lg mx-2 bg-gray-800 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center py-2">
                        <img className="w-40 h-40 rounded-full border-2 border-orange-400 m-1" src="https://randomuser.me/api/portraits/men/71.jpg" alt="profile" />
                        <h1 className="text-lg font-bold mb-3 text-center text-white">@{userInfo?.username}</h1>
                        <button className='border-2 border-orange-400 px-3 py-1 rounded-lg'>Subir foto</button>
                    </div>
                </div>
                
                <div className="w-full md:w-2/3">
                    <div className="info border-2 border-gray-300 p-3 rounded-xl bg-gray-800">
                        <h3 className="text-3xl font-bold mb-2 text-center text-white">Información Personal</h3>
                        <div className="flex flex-col justify-center items-center space-y-4">
                            <div className="flex flex-col items-center">
                                <label className="block text-xl text-gray-300 font-semibold">Nombre:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedUserInfo.name}
                                        onChange={handleChange}
                                        className="mt-1 p-2 px-10 border-2 border-orange-400 rounded-md bg-gray-700 text-white text-center w-48"
                                    />
                                ) : (
                                    <p className="mt-1 p-2 px-10 border-2 border-orange-400 rounded-md bg-gray-700 text-white text-center w-48">
                                        {userInfo?.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="block text-xl text-gray-300 font-semibold">Email:</label>
                                <p className="mt-1 p-2 px-10 border-2 border-orange-400 rounded-md bg-gray-700 text-white">
                                    {maskEmail(userInfo?.email)}
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="block text-xl text-gray-300 font-semibold">Teléfono:</label>
                                <p className="mt-1 p-2 px-10 border-2 border-orange-400 rounded-md bg-gray-700 text-white">
                                    {maskPhoneNumber(userInfo?.phone)}
                                </p>
                            </div>
                        </div>
                        <div className="text-center py-3 my-3 w-auto">
                            <button onClick={handleEditClick} className="border-2 border-orange-400 px-3 py-1 rounded-lg">
                                {isEditing ? 'Confirmar' : 'Editar Nombre'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <p className='text-center m-2 font-semibold'>
                <span className='text-orange-400 font-bold text-xl'>Frase motivacional: </span>
                <span className='text-white'>Me encanta esta app</span>
            </p>
            <ProfileStatsComponent />
        </div>
    );
};

export default ProfileUserInfoComponent;

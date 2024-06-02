import { useEffect, useState } from 'react';
import ProfileStatsComponent from './ProfileStatsComponent.jsx';
import ProfileSettingsButtons from './ProfileSettingsButtons.jsx';
import Tooltip from '../tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';

const ProfileUserInfoComponent = () => {
    const [userInfo, setUserInfo] = useState(null);
    const token = sessionStorage.getItem('jwtToken');
    const [imgUrl, setImgUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState({ name: ''});
    const [selectedFile, setSelectedFile] = useState(null);

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const maskEmail = (email) => {
        if (!email) return '';
        const [localPart, domainPart] = email.split('@');
        const maskedLocalPart = localPart.charAt(0) + '***';
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
            const response = await fetch(`https://forge-habits.vercel.app/api/users/info`, {
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
            const response = await fetch(`https://forge-habits.vercel.app/api/users/${userInfo?.id}`, {
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

    const getProfileImage = async () => {
        if (!userInfo?.id) return;
        
        try {
            const response = await fetch(`https://forge-habits.vercel.app/api/images/${userInfo.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImgUrl(imageUrl);
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }
    };

    const handleUploadClick = async () => {
        if (!selectedFile) {
            setError('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        try {
            const response = await fetch(`https://forge-habits.vercel.app/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const imageUrl = URL.createObjectURL(selectedFile);
            setImgUrl(imageUrl);
        } catch (error) {
            console.error("Error uploading profile image:", error);
        }
    };


    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        getProfileImage();
    }, [userInfo]);

    return (
        <div className="container mx-auto my-10 p-5 bg-gray-700 shadow-2xl rounded-xl">
            <div className='flex items-center justify-between'>
                <h1 className=' text-2xl md:text-4xl font-bold text-white m-3'>
                    Perfil de <span className='text-orange-300'>{userInfo?.name}</span>
                </h1>
                <div className='flex-shrink-0 ml-auto'>
                    <ProfileSettingsButtons />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-center">
                <div className="w-full md:w-1/3 mb-10 md:mb-0 border-2 border-gray-300 rounded-lg mx-2 bg-gray-800 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center py-4 rounded-lg shadow-lg p-6">
                        <Tooltip content="Que guapx estas hoy..." placement="top">
                            <img className="w-48 h-48 rounded-full border-4 border-orange-500 mb-4 object-cover shadow-md" src={imgUrl} alt="" />
                        </Tooltip>
                        <h1 className="text-lg md:text-2xl font-semibold mb-2 text-center text-white">@{userInfo?.username}</h1>
                        
                        <Tooltip content="Sube una foto de perfil" placement="top">
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-300 file:text-white hover:file:bg-orange-600"
                            />
                        </Tooltip>
                        
                        <Tooltip content="Selecciona una foto antes de pulsar" placement="bottom">
                            <button 
                                onClick={handleUploadClick} 
                                className='bg-orange-200 mt-4 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2'
                            >
                                Subir foto
                            </button>
                        </Tooltip>
                        
                    </div>
                </div>
                
                <div className="w-full md:w-2/3">
                    <div className="info border-2 border-gray-300 p-3 rounded-xl bg-gray-800 m-5">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">Información Personal</h3>
                        <div className="flex flex-col justify-center items-center space-y-4">
                            <div className="flex flex-col items-center">
                                <label className="block text-lg md:text-xl text-gray-300 font-semibold">Nombre:</label>
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
                                <label className="block text-lg md:text-xl text-gray-300 font-semibold">Email:</label>
                                <p className="mt-1 p-2 px-10 border-2 border-orange-400 rounded-md bg-gray-700 text-white">
                                    {maskEmail(userInfo?.email)}
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <label className="block text-lg md:text-xl text-gray-300 font-semibold">Teléfono:</label>
                                <p className="mt-1 p-2 px-10 border-2 border-orange-400 rounded-md bg-gray-700 text-white">
                                    {maskPhoneNumber(userInfo?.phone)}
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-center py-3 my-3 w-auto">
                            <Tooltip content="Solamente puedes editar el nombre" placement="bottom">
                                <button onClick={handleEditClick} className="bg-orange-200 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2">
                                    {isEditing ? 'Confirmar' : 'Editar Nombre'}
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <ProfileStatsComponent token={token} />
        </div>
    );
};

export default ProfileUserInfoComponent;

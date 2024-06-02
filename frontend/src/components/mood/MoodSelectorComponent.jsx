import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const MoodSelectorComponent = ({ selectedMood, setSelectedMood, page }) => {
    const token = sessionStorage.getItem('jwtToken');
    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    const [message, setMessage] = useState('');

    const fetchMood = async () => {
        if (page === 'dashboard') {
            const apiUrl = `https://forge-habits.vercel.app/api/diary/${formattedDate}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSelectedMood(data.mood || '');
                } else if (response.status === 404) {
                    setSelectedMood('');
                } else {
                    throw new Error('Error fetching mood');
                }
            } catch (error) {
                console.error('Error:', error);
                setSelectedMood('');
            }
        }
    };

    useEffect(() => {
        fetchMood();
    }, [page]);

    const saveMood = async (mood) => {
        const apiUrl = `https://forge-habits.vercel.app/api/diary/${formattedDate}`;

        try {
            const checkResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            let saveMethod;
            let body;

            if (checkResponse.ok) {
                saveMethod = 'PATCH';
                body = JSON.stringify({ mood: mood || 'Normal' });
            } else if (checkResponse.status === 404) {
                saveMethod = 'POST';
                body = JSON.stringify({ text: '', mood: mood || 'Normal' });
            } else {
                throw new Error('Error verificando la existencia del diario');
            }

            const saveResponse = await fetch(apiUrl, {
                method: saveMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: body,
            });

            if (saveResponse.ok) {
                setMessage('Mood guardado correctamente');
            } else {
                throw new Error('No se pudo guardar el diario');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleMoodChange = async (mood) => {
        if (mood === selectedMood) {
            return;
        }
        setSelectedMood(mood);
        await saveMood(mood);
    };

    return (
        <section className='bg-gray-800 shadow-lg p-4 mb-10 sm:p-6 rounded-xl max-w-md mx-auto'>
            <h2 class="font-semibold text-center text-md md:text-lg mx-4 text-orange-100 animate-fade-left mb-5">Aquí puedes seleccionar tu <span className='text-orange-300'>estado de ánimo</span> actual.</h2>
            <div className='flex justify-around border-white p-2 sm:p-4 rounded-xl bg-gray-300 space-x-1 sm:space-x-2'>
                <button
                    className={`p-3 sm:p-4 rounded-full ${selectedMood === 'Bueno' ? 'bg-green-500' : 'bg-gray-500'} hover:bg-green-400 transition duration-300`}
                    onClick={() => handleMoodChange('Bueno')}
                >
                    <span role="img" aria-label="smile" className="text-3xl sm:text-5xl">😁</span>
                </button>
                <button
                    className={`p-3 sm:p-4 rounded-full ${selectedMood === 'Normal' ? 'bg-yellow-500' : 'bg-gray-500'} hover:bg-yellow-400 transition duration-300`}
                    onClick={() => handleMoodChange('Normal')}
                >
                    <span role="img" aria-label="neutral" className="text-3xl sm:text-5xl">😐</span>
                </button>
                <button
                    className={`p-3 sm:p-4 rounded-full ${selectedMood === 'Mal' ? 'bg-red-500' : 'bg-gray-500'} hover:bg-red-400 transition duration-300`}
                    onClick={() => handleMoodChange('Mal')}
                >
                    <span role="img" aria-label="cry" className="text-3xl sm:text-5xl">😭</span>
                </button>
            </div>
            {message && (
                <p className="flex items-center text-green-600 text-base sm:text-lg italic justify-center mt-2">
                    <span className="material-symbols-outlined text-md mr-2">
                        save_as
                    </span>
                    {message}
                </p>
            )}
        </section>
    );
};

export default MoodSelectorComponent;

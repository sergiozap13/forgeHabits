import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const MoodSelectorComponent = ({ selectedMood, setSelectedMood, page }) => {
    const token = sessionStorage.getItem('jwtToken');
    const formattedDate = format(new Date(), 'yyyy-MM-dd');

    const fetchMood = async () => {
        if (page === 'dashboard') {
            const apiUrl = `http://localhost:3000/api/diary/${formattedDate}`;
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

    const handleSaveDiary = async () => {
        const apiUrl = `http://localhost:3000/api/diary/${formattedDate}`;
    
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
                body = JSON.stringify({ mood: selectedMood || 'Normal' });
            } else if (checkResponse.status === 404) {
                saveMethod = 'POST';
                body = JSON.stringify({ text: '', mood: selectedMood || 'Normal' });
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
                alert('Diario guardado correctamente');
            } else {
                throw new Error('No se pudo guardar el diario');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <section className='bg-gray-700 shadow-lg p-6 rounded-lg max-w-md mx-auto'>
            <div className='flex justify-around border-white p-4 rounded-xl bg-gray-300 space-x-2'>
                <button
                    className={`p-4 rounded-full ${selectedMood === 'Bueno' ? 'bg-green-500' : 'bg-gray-500'} hover:bg-green-400 transition duration-300`}
                    onClick={() => setSelectedMood('Bueno')}
                >
                    <span role="img" aria-label="smile" className="text-5xl">😁</span>
                </button>
                <button
                    className={`p-4 rounded-full ${selectedMood === 'Normal' ? 'bg-yellow-500' : 'bg-gray-500'} hover:bg-yellow-400 transition duration-300`}
                    onClick={() => setSelectedMood('Normal')}
                >
                    <span role="img" aria-label="neutral" className="text-5xl">😐</span>
                </button>
                <button
                    className={`p-4 rounded-full ${selectedMood === 'Mal' ? 'bg-red-500' : 'bg-gray-500'} hover:bg-red-400 transition duration-300`}
                    onClick={() => setSelectedMood('Mal')}
                >
                    <span role="img" aria-label="cry" className="text-5xl">😭</span>
                </button>
            </div>
            {page === 'dashboard' && (
                <div className='flex justify-center mt-4'>
                    <button onClick={handleSaveDiary} className='font-bold text-xl py-3 px-6 text-center rounded-xl bg-orange-400 hover:bg-orange-500 text-white transition ease-in-out duration-300'>
                        Guardar
                    </button>
                </div>
            )}
        </section>
    );
};

export default MoodSelectorComponent;

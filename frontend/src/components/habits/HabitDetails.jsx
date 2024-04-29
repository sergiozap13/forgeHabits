import React, { useEffect, useState } from 'react';

const HabitDetails = ({ habitId }) => {
    const [habit, setHabit] = useState(null);
    const [habitInfo, setHabitInfo] = useState(null);
    const [tips, setTips] = useState([]);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [tipOpacity, setTipOpacity] = useState(1);

    const token = sessionStorage.getItem('jwtToken');

    const handleDelete = async () => {
        const apiUrl = `http://localhost:3000/api/habits/habit/${habitId}`;
    
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            });
    
            if (response.ok) {
                console.log('Hábito eliminado correctamente');
                window.location.href = '/myhabits'; 
            } else {
                throw new Error('No se pudo eliminar el hábito');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        async function fetchHabit() {
            if (!habitId || !token) return;
            const response = await fetch(`http://localhost:3000/api/habits/habit/${habitId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const data = await response.json();
            setHabit(data);
        }

        async function fetchHabitInfo() {
            if (!habitId || !token) return;
            const response = await fetch(`http://localhost:3000/api/habits/habit/${habitId}/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const data = await response.json();
            setHabitInfo(data);
        }

        async function fetchHabitTips() {
            if (!habitId || !token) return;
            const response = await fetch(`http://localhost:3000/api/habits/habit/${habitId}/tips`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const data = await response.json();
            setTips(data); 
        }

        fetchHabit();
        fetchHabitInfo();
        fetchHabitTips();
    }, [habitId, token]);

    useEffect(() => {
        if (tips.length > 0) { 
            const interval = setInterval(() => {
                setTipOpacity(0); 
                setTimeout(() => {
                    setCurrentTipIndex(prevIndex => (prevIndex + 1) % tips.length);
                    setTipOpacity(1); 
                }, 1000); 
            }, 7500);
    
            return () => clearInterval(interval);
        }
    }, [tips, tips.length]);

    let category = '';
    let category_color = '';
    if(habitInfo) { 
        switch (habitInfo.category) {
            case "SaludMental":
                category = "Salud mental";
                category_color = "blue";
                break;
            case "SaludFisica":
                category = "Salud física";
                category_color = "red";
                break;
            case "Alimentacion":
                category = "Alimentación";
                category_color = "green";
                break;
            default:
                break;
        }
    }

    let status = '';
    let status_color = '';
    if (habit) {
        switch (habit.status) {
            case "EnProceso":
                status = "En proceso de ser forjado";
                status_color = "yellow";
                break;
            case "SinIniciar":
                status = "Sin iniciar";
                status_color = "gray";
                break;
            default:
                break;
        }
    }



    return (
        <div className="text-white p-8 ">
            <div className={`flex flex-col items-center border-2 bg-${habitInfo && habitInfo.default_color}-500 rounded-xl shadow-xl p-6 min-h-screen`}>
                <div className="flex items-center space-x-4 mb-4">
                    <div className={`rounded-full border-${habitInfo?.text_color} bg-${habitInfo && habitInfo.default_color}-500 p-2 border-2`}>
                        <svg className={`w-6 h-6 text-${habitInfo?.text_color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className={`text-3xl text-${habitInfo?.text_color} font-bold uppercase`}>{habitInfo && habitInfo.name}</div>
                </div>

                <div className={`text-center w-full p-15 pb-1 mb-6 bg-white bg-opacity-90 rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:bg-opacity-100 space-y-10`}>
                <div className="text-xl text-gray-900 font-bold shadow">Categoría: 
                    <span className={`font-semibold text-${category_color}-700`}> {category}</span>
                </div>
                <div className="text-xl text-gray-900 font-bold shadow">
                    Estado: <span className={`text-md font-semibold text-${status_color}-700`}>{status}</span></div>
                <div className="my-4 text-gray-900">
                    <span className="font-bold text-xl text-gray-900 shadow">Racha actual:</span> 
                    
                    <span className='font-bold text-xl'> {habit?.current_streak}</span> (
                        <span className="text-red-600">{21 - habit?.current_streak}</span> días para forjarlo)
                </div>
                <div className="my-4 text-gray-900">
                    <span className="font-bold text-xl text-gray-900 shadow">Mejor racha:</span> <span className='font-bold text-xl'>{habit?.best_streak}</span> días
                </div>
                <div className="my-4 text-gray-900">
                    <span className="font-bold text-xl text-gray-900 shadow">Veces forjado:</span> {habit?.times_forged} (Objetivo: <span className='font-bold text-red-800'>{habit?.times_forged_goal}</span>)
                </div>
            </div>



                <div className="bg-green-300 p-4 rounded-lg w-full mb-6 overflow-hidden">
                    <div className="font-bold text-xl mb-3 text-center">Nuestros consejos:</div>
                    <div className="flex justify-center">
                        <div className={`border-2 border-green-700 p-2 rounded-lg transition-opacity duration-1000 ease-in-out ${tipOpacity ? 'opacity-100' : 'opacity-0'}`}>
                            {tips.length > 0 ? tips[currentTipIndex] : "No hay tips disponibles."}
                        </div>
                    </div>
                </div>


                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleDelete}>
                    Eliminar
                </button>
            </div>
        </div>
    );
}

export default HabitDetails;


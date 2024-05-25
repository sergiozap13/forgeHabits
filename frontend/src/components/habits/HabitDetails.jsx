import Tooltip from '../../components/tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';
import { useEffect, useState } from 'react';

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
                status_color = "orange";
                break;
            case "SinIniciar":
                status = "Sin iniciar";
                status_color = "gray";
                break;
            case "Forjado":
                status = "Forjado";
                status_color = "green";
                break;
            case "Interiorizado":
                status = "Interiorizado";
                status_color = "red";
                break;
            default:
                break;
        }
    }

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDeleteClick = () => {
        if (confirmDelete) {
        handleDelete();
        } else {
        setConfirmDelete(true);
        }
    };



    return (
        <div className="text-white p-3 bg-gray-800 animate-fade-right">
            <div className={`flex flex-col items-center justify-center mx-auto bg-${habitInfo?.default_color} rounded-xl shadow-2xl p-6 max-w-3xl`}>
                <div className="flex items-center space-x-4 mb-4">
                    <span className='material-symbols-outlined text-4xl text-black'>{habitInfo?.material_icon}</span>
                    <h1 className={`text-3xl text-${habitInfo?.text_color} font-bold uppercase`}>
                        {habitInfo?.name}
                    </h1>
                </div>

                <div className="text-center p-6 pb-1 mb-6 bg-gray-700 bg-opacity-90 rounded-lg shadow-2xl transition-all duration-300 ease-in-out hover:bg-opacity-100 grid grid-cols-1 md:grid-cols-2 gap-6 hover:scale-105">
                    <div className="col-span-1 md:col-span-2 text-xl font-bold text-white">
                        <Tooltip content="Progreso del hábito o Cómo avanzas con este hábito">
                            Estado: <span className={`text-md font-semibold text-${status_color}-500`}>{status}</span>
                        </Tooltip>
                    </div>
                    <div className="col-span-1 text-xl text-white">
                        <Tooltip content="Días seguidos cumpliendo el hábito">
                            <span className='font-bold'>Racha actual</span>: <span className='text-blue-400 font-semibold'> {habit?.current_streak}</span> días (<span className="text-red-400">{21 - habit?.current_streak}</span> días para forjarlo)
                        </Tooltip>
                    </div>
                    <div className="col-span-1 text-xl text-white">
                        <Tooltip content="Mejor racha de días seguidos cumpliendo este hábito">
                            <span className='font-bold'>Mejor racha</span>: <span className='text-green-400 font-semibold'>{habit?.best_streak}</span> días
                        </Tooltip>
                    </div>
                    <div className="col-span-1 md:col-span-2 text-xl text-white">
                        <Tooltip content="Forjar un hábito es realizarlo durante 21 días seguidos">
                            <span className='font-bold'>Veces forjado</span>: {habit?.times_forged} (Objetivo: <span className='text-red-400'>{habit?.times_forged_goal}</span>)
                        </Tooltip>
                    </div>
                </div>

                <div className="bg-gray-600 p-4 rounded-lg w-full mb-6 overflow-hidden shadow">
                    <div className={`font-bold text-xl mb-3 text-center text-${habitInfo?.text_color}`}>Nuestros consejos:</div>
                    <div className="flex justify-center">
                        <div className={`border-2 border-${habitInfo?.text_color} text-${habitInfo?.text_color} p-2 rounded-lg transition-opacity duration-300 ease-in-out ${tipOpacity ? 'opacity-100' : 'opacity-0'}`}>
                            {tips.length > 0 ? tips[currentTipIndex] : "No hay tips disponibles."}
                        </div>
                    </div>
                </div>

                <Tooltip content="Si eliminas el hábito pierdes todo el progreso">
                    <button 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 border rounded-lg text-lg transition-colors duration-200" 
                        onClick={handleDeleteClick}
                        >
                        {confirmDelete ? 'Confirmar eliminación' : 'Eliminar'}
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}

export default HabitDetails;


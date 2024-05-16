import { useState, useEffect } from 'react';
import { format, addDays, isToday, isBefore, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import MoodSelectorComponent from '../mood/MoodSelectorComponent';

const DiaryDisplayComponent = () => {
    const [currentDay, setCurrentDay] = useState(new Date());
    const [diaryData, setDiaryData] = useState({ text: '', mood: '' });
    const [selectedMood, setSelectedMood] = useState('');
    const [diaryNotFound, setDiaryNotFound] = useState(false);
    const [placeholderText, setPlaceholderText] = useState('');
    const [animateDirection, setAnimateDirection] = useState('');
    const token = sessionStorage.getItem('jwtToken');

    const formattedDate = format(currentDay, 'yyyy-MM-dd');

    const fetchDiaryData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/diary/${formattedDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            if (!response.ok) {
                if (response.status === 404) {
                    setDiaryData({ text: 'No hay texto en el diario para este día.', mood: '' });
                    setDiaryNotFound(true);
                    setSelectedMood('');
                    if (isToday(currentDay)) {
                        setPlaceholderText('Escribe lo que quieras');
                        setDiaryData({ text: '', mood: '' });
                    } else {
                        setPlaceholderText('');
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
            } else {
                const diaryData = await response.json();
                setDiaryData(diaryData);
                setSelectedMood(diaryData.mood || '');
                setDiaryNotFound(false);
                setPlaceholderText('');
            }
        } catch (error) {
            console.error("Error fetching diary:", error);
            setDiaryData({ text: 'Error al cargar el texto del diario.', mood: '' });
            setDiaryNotFound(true);
            setPlaceholderText('');
        }
    };
    
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
                saveMethod = 'PATCH'; // La entrada ya existe, usar PATCH
                body = JSON.stringify({ text: diaryData.text, mood: selectedMood || 'Normal' });
            } else if (checkResponse.status === 404) {
                saveMethod = 'POST'; // La entrada no existe, usar POST
                body = JSON.stringify({ mood: selectedMood || 'Normal', text: diaryData.text });
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

    const handleDeleteDiary = async () => {
        const apiUrl = `http://localhost:3000/api/diary/${formattedDate}`;
    
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                }
            });

            if (response.ok) {
                alert('Diario borrado correctamente');
            } else {
                throw new Error('No se pudo borrar el diario');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {   
        fetchDiaryData();
    }, [currentDay]);

    useEffect(() => {
        setAnimateDirection(animateDirection);
        const timer = setTimeout(() => setAnimateDirection(''), 750); 
        return () => clearTimeout(timer);
    }, [currentDay]);

    const handleTextChange = (event) => {
        if (!isBefore(currentDay, startOfToday())) {
            setDiaryData(prevData => ({
                ...prevData,
                text: event.target.value
            }));
            setPlaceholderText('');
        }
    };

    const changeDay = (direction) => {
        setAnimateDirection(direction);
        setCurrentDay(addDays(currentDay, direction === 'right' ? 1 : -1));
    };

    const isPastDay = isBefore(new Date(formattedDate), startOfToday());
    const textColorClass = diaryNotFound ? 'text-red-600' : (isPastDay ? 'text-gray-700' : 'text-gray-800');

    return (
        <section className='bg-gray-700 shadow-lg p-2 rounded-lg mt-3 max-w-3xl mx-auto'>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-300 to-orange-200 shadow-lg rounded-lg">
                <button 
                    onClick={() => changeDay('left')} 
                    className="material-symbols-outlined text-2xl text-white hover:text-gray-300 transition-colors duration-300"
                >
                    arrow_back
                </button>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                    {format(currentDay, "EEEE, d 'de' MMMM 'del' yyyy", { locale: es })}
                </h2>
                <button 
                    onClick={() => !isToday(currentDay) && changeDay('right')}  
                    className={`material-symbols-outlined text-2xl transition-colors duration-300 ${isToday(currentDay) ? 'text-gray-400' : 'text-white hover:text-gray-300'}`} 
                    disabled={isToday(currentDay)}
                >
                    arrow_forward
                </button>        
            </div>
            <div className={`min-h-96 p-2 ${animateDirection === 'right' ? 'animate-fade-right' : animateDirection === 'left' ? 'animate-fade-left' : ''}`}>
                <div className="border-2 border-white p-8 m-5 min-h-96 rounded-xl bg-white bg-opacity-80 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-grid-lines bg-size-grid-lines pointer-events-none"></div>
                    <textarea
                        value={diaryData.text}
                        onChange={handleTextChange}
                        placeholder={isToday(currentDay) && !diaryData.text ? 'Escribe lo que quieras' : ''}
                        disabled={isPastDay}
                        className={`w-full h-96 p-4 text-xl text-center font-semibold leading-relaxed bg-transparent resize-none focus:outline-none z-10 ${textColorClass}`}
                    />
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <MoodSelectorComponent selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
                {!isPastDay && (
                    <button 
                        onClick={handleSaveDiary}
                        type='submit' 
                        className='font-bold text-xl py-3 px-6 mb-3 mr-10 text-center rounded-xl hover:scale-105 hover:shadow-xl transition ease-in-out duration-300 border-2 border-orange-300 bg-orange-200 text-gray-800'
                    >  
                        Guardar
                    </button>
                )}
            </div>
        </section>
    )
}

export default DiaryDisplayComponent;

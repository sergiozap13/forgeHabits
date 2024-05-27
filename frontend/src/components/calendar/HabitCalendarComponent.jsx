import { useEffect, useState } from 'react';

// TODO: hacer el completado de los habitos parcial

const HabitCalendarComponent = ({ habit, token, updateCompletionState, completed, currentDay, isPastDay, compact }) => {
    const [habitDetails, setHabitDetails] = useState(null);
    const [habitInfo, setHabitInfo] = useState(null);

    useEffect(() => {
        const fetchHabitDetails = async () => {
            try {
                const unitResponse = await fetch(`http://localhost:3000/api/habits/habit/${habit.id}/unit`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                const unitData = await unitResponse.json();

                const detailsResponse = await fetch(`http://localhost:3000/api/habits/habit/${habit.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                const detailsData = await detailsResponse.json();

                setHabitDetails({
                    ...unitData,
                    ...detailsData
                });

                const habitInfo = await fetch(`http://localhost:3000/api/habits/habit/${habit.id}/info`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    }
                });
                const habitInfoData = await habitInfo.json();

                setHabitInfo(habitInfoData);
            } catch (error) {
                console.error('Failed to fetch habit details:', error);
            }
        };

        fetchHabitDetails();
    }, [habit.id, token]);

    const handleComplete = async () => {
        const method = completed ? 'DELETE' : 'POST';
        try {
            const response = await fetch(`http://localhost:3000/api/completions`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ habitId: habit.id, date: currentDay })
            });
        
            if (!response.ok) {
                throw new Error('Failed to update completion status');
            }

            const streaksResponse = await fetch(`http://localhost:3000/api/habits/habit/${habit.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (!streaksResponse.ok) {
                throw new Error('Failed to update habit streak');
            }
    
            updateCompletionState(habit.id, !completed);
        } catch (error) {
            console.error('Error updating habit completion:', error);
            alert('Error completing the habit: ' + error.message);
        }
    };


    if (!habitDetails) return <div>Loading habit details...</div>;

   const habitClass = completed ?
        "bg-gray-300 text-gray-600 cursor-not-allowed opacity-75" :
        `bg-${habit.default_color} text-${habit.text_color}`;

        return (
            <div className={`flex items-center ${habitClass} p-2 my-5 rounded-lg transition border-2 border-black duration-500 ease-in-out shadow-md transform`}>
                <div className='icon mx-4'>
                    <span className='material-symbols-outlined text-3xl text-black'>{habitInfo?.material_icon}</span> 
                </div>
                <div className="flex-1">
                    <h3 className="md:text-xl text-sm font-bold text-center text-gray-900">{habit.name}</h3>
                </div>
                <button
                    className={`inline-flex items-center justify-center px-3 py-1 bg-orange-200 hover:bg-orange-400 text-black text-xs font-bold rounded-full border border-black shadow transition duration-300 ease-in-out ${completed || isPastDay ? 'cursor-not-allowed opacity-60' : ''}`}
                    onClick={handleComplete}
                    disabled={completed || isPastDay}
                    style={{ minWidth: "100px" }}
                >
                    <span className="material-symbols-outlined text-xl mr-1">
                        {completed ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    {completed ? 
                        (habitDetails.unit ? `${habitDetails.settings.daily_goal}/${habitDetails.settings.daily_goal} ${habitDetails.unit}` : "Completado") :
                        (habitDetails.unit ? `0/${habitDetails.settings.daily_goal} ${habitDetails.unit}` : "Completar")
                    }
                </button>
            </div>
        );
        
};

export default HabitCalendarComponent;

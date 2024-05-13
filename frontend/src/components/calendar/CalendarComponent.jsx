import { useState, useEffect } from 'react';
import { format, addDays, isToday, isBefore, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import HabitCalendarComponent from './HabitCalendarComponent';

const CalendarComponent = () => {
    const [currentDay, setCurrentDay] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [completedHabits, setCompletedHabits] = useState([]);
    const token = sessionStorage.getItem('jwtToken');

    const formattedDate = format(currentDay, 'yyyy-MM-dd');

    const fetchHabits = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/habits/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const habitsData = await response.json();
            setHabits(habitsData);
        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    };

    const fetchCompletedHabits = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/completions/${formattedDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const habitsData = await response.json();
            console.log(habitsData);
            setCompletedHabits(habitsData);
        } catch (error) {
            console.error("Error fetching completed habits:", error);
        }
    };

    const updateCompletedHabits = (habitId, completed) => {
        setCompletedHabits(prev => {
            if (completed) {
                return [...prev, { habit_id: habitId }];
            } else {
                return prev.filter(h => h.habit_id !== habitId);
            }
        });
    };

    // ordena los hábitos por si están completados o no
    const sortedHabits = habits.slice().sort((a, b) => {
        const aCompleted = completedHabits.some(ch => ch.habit_id === a.id);
        const bCompleted = completedHabits.some(ch => ch.habit_id === b.id);
        return aCompleted - bCompleted;
    });

    const isPastDay = isBefore(new Date(formattedDate), startOfToday());

    useEffect(() => {
        fetchHabits();
        fetchCompletedHabits();  
    }, [currentDay]);

    return (
        <section className='bg-gray-700 shadow-lg p-2 rounded-lg mt-3 max-w-lg mx-auto'>
        <div className="flex justify-between items-center p-2">
            <button onClick={() => setCurrentDay(addDays(currentDay, -1))} className="material-symbols-outlined text-2xl text-white">arrow_back</button>
            <h2 className="text-xl font-bold text-white">
                {format(currentDay, "EEEE, d 'de' MMMM 'del' yyyy", { locale: es })}
            </h2>
            <button 
                onClick={() => !isToday(currentDay) && setCurrentDay(addDays(currentDay, 1))} 
                className="material-symbols-outlined text-2xl text-white" 
                disabled={isToday(currentDay)} 
                style={{ color: isToday(currentDay) ? 'gray' : 'white' }}>
                    arrow_forward
            </button>        
        </div>
        <div>
            {sortedHabits.map(habit => (
                <HabitCalendarComponent
                    key={habit.id}
                    token={token}
                    habit={habit}
                    updateCompletionState={updateCompletedHabits}
                    completed={completedHabits.some(ch => ch.habit_id === habit.id)}
                    currentDay={formattedDate}
                    isPastDay={isPastDay}
                    compact={false}
                />
            ))}
        </div>
    </section>
    
    );
};

export default CalendarComponent;

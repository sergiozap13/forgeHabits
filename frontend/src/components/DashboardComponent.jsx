import { useEffect, useState } from 'react';
import HabitComponent from './habits/HabitComponent';
import HabitCalendarComponent from './calendar/HabitCalendarComponent';
import { isBefore, startOfToday, format } from 'date-fns';

const DashboardComponent = () => {
    const [habits, setHabits] = useState([]);
    const [completedHabits, setCompletedHabits] = useState([]);
  
    const token = sessionStorage.getItem('jwtToken');
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');

    const fetchHabits = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/habits/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const completionData = await response.json();
            console.log(completionData);
            setCompletedHabits(completionData);
        } catch (error) {
            console.error("Error fetching completed habits:", error);
        }
    };

    const updateCompletedHabits = (habitId, completed) => {
      setCompletedHabits(prev => {
          const updatedHabits = completed
              ? [...prev, { habit_id: habitId }]
              : prev.filter(h => h.habit_id !== habitId);
          
          return updatedHabits;
      });
  };

    const sortedHabits = habits.slice().sort((a, b) => {
        const aCompleted = completedHabits.some(ch => ch.habit_id === a.id);
        const bCompleted = completedHabits.some(ch => ch.habit_id === b.id);
        return aCompleted - bCompleted;
    });

    const isPastDay = isBefore(new Date(formattedDate), startOfToday());

    useEffect(() => {
        fetchHabits();
        fetchCompletedHabits();  
    }, [token]);

    return (
      <main className="max-w-7xl px-4 mx-auto min-h-screen">
        <p className="text-center mt-4">ForgeHabits is a habit tracking app that helps you build good habits and break bad ones.</p> 
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-xl shadow border-2">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Mis Hábitos</h2>
            <div className="grid grid-cols-2 gap-4">
              {habits.map((habit) => (
                <div key={habit.id + (completedHabits.some(ch => ch.habit_id === habit.id) ? 'completed' : 'not-completed')} className='p-1'>
                  <HabitComponent
                    title={habit.name}
                    streak={habit.current_streak}
                    bgcolor={habit.default_color}
                    textcolor={habit.text_color}
                    compact={true}
                  />
                </div>
              ))}
            </div>
            <div className="w-full text-center mt-8">
              <a href="/myhabits" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">
                Ver todos mis hábitos
              </a>
            </div>
          </div>

          <div className="p-4 shadow border-2 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Calendario de Hábitos</h2>
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
                  compact={true}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="/calendar" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">
                Ver calendario
              </a>
            </div>
          </div>


        </div>
      </main>
    );
};

export default DashboardComponent;

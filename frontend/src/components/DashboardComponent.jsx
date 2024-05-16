import { useEffect, useState } from 'react';
import HabitComponent from './habits/HabitComponent';
import HabitCalendarComponent from './calendar/HabitCalendarComponent';
import { isBefore, startOfToday, format } from 'date-fns';
import MoodSelectorComponent from './mood/MoodSelectorComponent';

const DashboardComponent = () => {
    const [habits, setHabits] = useState([]);
    const [completedHabits, setCompletedHabits] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [selectedMood, setSelectedMood] = useState('');
  
    const token = sessionStorage.getItem('jwtToken');
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');

    // funciones para obtener los datos necesarios
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

    const sortedHabits = habits.slice().sort((a, b) => {
        const aCompleted = completedHabits.some(ch => ch.habit_id === a.id);
        const bCompleted = completedHabits.some(ch => ch.habit_id === b.id);
        return aCompleted - bCompleted;
    });

    const isPastDay = isBefore(new Date(formattedDate), startOfToday());

    useEffect(() => {
        fetchHabits();
        fetchCompletedHabits();  
        fetchUserInfo();
    }, [token]);

    return (
      <main className="max-w-7xl px-4 mx-auto min-h-screen">
          <h2 class="font-semibold text-center mx-4 text-orange-100 animate-fade-right">Estamos en la página de inicio, <span className='text-orange-300'>{userInfo?.username}</span>. Aquí puedes ver los <span className='text-orange-300'>hábitos</span> que tienes configurados.</h2>        
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-xl shadow border-2 animate-fade-right">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Mis Hábitos</h2>
            {habits.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {habits.map((habit) => (
                  <div key={habit.id + (completedHabits.some(ch => ch.habit_id === habit.id) ? 'completed' : 'not-completed')} className='p-1'>
                    <HabitComponent
                      title={habit.name}
                      streak={habit.current_streak}
                      bgcolor={habit.default_color}
                      textcolor={habit.text_color}
                      icon={habit.material_icon}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white text-center font-bold">¡Empieza ya a configurar <span className='text-orange-200'>hábitos</span>!</p>
            )}
            <div className="w-full text-center mt-8">
              <a href={habits.length > 0 ? "/myhabits" : "habits"} className="font-bold text-md p-2 mb-3 border-orange-300 bg-orange-200 text-gray-800 text-center rounded-xl hover:scale-105 hover:shadow-xl transition ease-in-out duration-300 border-2">
                {habits.length === 0 ? 'Configurar nuevos hábitos' : 'Ver todos mis hábitos'}
              </a>
            </div>
          </div>
            
          <div className="p-4 shadow border-2 rounded-xl animate-fade-left">
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
            {habits.length === 0 && (
              <p className="text-white text-center font-bold mt-4">Configura nuevos <span className='text-orange-200'>hábitos</span> para empezar a gestionar el <span className='text-orange-200'>calendario</span></p>
            )}
            <div className="text-center mt-8">
              <a href="/calendar" className="font-bold text-md p-2 mb-3 border-orange-300 bg-orange-200 text-gray-800 text-center rounded-xl hover:scale-105 hover:shadow-xl transition ease-in-out duration-300 border-2">
                {habits.length === 0 ? 'Calendario vacío :(' : 'Ver calendario'}
              </a>
            </div>
          </div>


        </div>
        <h2 class="font-semibold text-center mx-4 text-orange-100 animate-fade-left">Aquí puedes seleccionar tu <span className='text-orange-300'>estado de ánimo</span> actual.</h2>
        <MoodSelectorComponent selectedMood={selectedMood} setSelectedMood={setSelectedMood} page={'dashboard'}/>
      </main>
    );
};

export default DashboardComponent;

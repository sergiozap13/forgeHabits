import { useEffect, useState } from 'react';
import HabitComponent from './habits/HabitComponent';
import HabitCalendarComponent from './calendar/HabitCalendarComponent';
import { isBefore, startOfToday, format } from 'date-fns';
import MoodSelectorComponent from './mood/MoodSelectorComponent';
import Tooltip from '../components/tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';

const DashboardComponent = () => {
    const [habits, setHabits] = useState([]);
    const [completedHabits, setCompletedHabits] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [selectedMood, setSelectedMood] = useState('');
    const [userPerformance, setUserPerformance] = useState(null);
  
    const token = sessionStorage.getItem('jwtToken');
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');

    // funciones para obtener los datos necesarios
    const fetchHabits = async () => {
        try {
            const response = await fetch('https://forge-habits.vercel.app/api/habits/user', {
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
            const response = await fetch(`https://forge-habits.vercel.app/api/completions/${formattedDate}`, {
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

    const getUserPerformance = async () => {
      try {
          const response = await fetch('https://forge-habits.vercel.app/api/stats/performance', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          })
          const data = await response.json()
          setUserPerformance(data)
      } catch (error) {
          console.error('Error fetching user performance:', error)
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
        getUserPerformance();
    }, [token]);

    return (
      <main className="max-w-8xl px-4 mx-auto min-h-screen">
          <h2 class="font-semibold text-center mx-4 text-orange-100 animate-fade-right text-md md:text-xl">Estamos en la página de inicio, <span className='text-orange-300'>{userInfo?.username}</span>. Aquí puedes ver los <span className='text-orange-300'>hábitos</span> que tienes configurados.</h2>        
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow border-2 animate-fade-right">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Mis Hábitos</h2>
            {habits.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {habits.slice(0,4).map((habit) => (
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
            <div className="w-full text-center mt-5">
              <a href={habits.length > 0 ? "/myhabits" : "habits"} className="bg-orange-200 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2">
                {habits.length === 0 ? 'Configurar nuevos hábitos' : 'Ver todos mis hábitos'}
              </a>
            </div>
          </div>

          <div className="p-6 shadow rounded-xl animate-fade-left">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Calendario de Hábitos</h2>
            <div>
              {sortedHabits.slice(0,4).map(habit => (
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
            <div className="text-center mt-7">
              <a href="/calendar" className="bg-orange-200 text-gray-800 hover:bg-orange-400 transition-colors duration-400 text-md font-bold py-2 xl:py-3 px-4 sm:px-6 rounded-xl focus:outline-none focus:shadow-outline focus:border-orange-500 focus:bg-gray-800 focus:text-white focus:border-2">
                {habits.length === 0 ? 'Calendario vacío :(' : 'Ver calendario completo'}
              </a>
            </div>
          </div>


        </div>
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1 flex flex-col items-center justify-center lg:mx-20'>
            
            <MoodSelectorComponent selectedMood={selectedMood} setSelectedMood={setSelectedMood} page={'dashboard'}/>
          </div>
          <div className='flex-1 flex flex-col p-8 m-5 lg:m-8 border-2 border-white rounded-xl bg-gray-800 text-center text-white shadow-lg'>
            <Tooltip content="Este es tu rendimiento actual en la aplicación: Hábitos completados vs Todos los que podías haber completado">
              <h2 className="text-2xl font-bold mb-2">Rendimiento Actual</h2>
            </Tooltip>
            <p className="font-semibold my-10"> <span className='font-bold text-orange-200'>{userPerformance?.completed} / {userPerformance?.total}</span>  completados ({userPerformance?.percentage}%)</p>
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-orange-100 rounded-lg h-6 m-auto relative overflow-hidden">
              <div className="bg-orange-500 h-6 rounded-lg transition-all duration-500 ease-out flex items-center justify-center" style={{ width: `${userPerformance?.percentage}%` }}>
                <span className="text-white text-xs sm:text-sm md:text-base font-bold">{userPerformance?.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    );
};

export default DashboardComponent;

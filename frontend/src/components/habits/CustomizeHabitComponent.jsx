import { useEffect, useState } from 'react';
import Tooltip from '../../components/tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';


const CustomizeHabitComponent = ({ habitId }) => {
    const [habitInfo, setHabitInfo] = useState(null);
    const [habitUnit, setHabitUnit] = useState(null);
    const [error, setError] = useState('');

    const token = sessionStorage.getItem('jwtToken');

    const [habitData, setHabitData] = useState({
      dailyGoal: 0,
      commitmentLevel: 'Bueno',
      preferredTime: '12:00',
      customColor: 'red'
    });

  const handleSubmit = async (event) => {
      event.preventDefault(); 
    
      if (habitUnit && habitUnit.goals && habitData.dailyGoal === 0) {
        setError('Por favor, selecciona un objetivo diario.');
        return;
    }

      const apiUrl = `https://forge-habits.vercel.app/api/habits/habit/${habitId}`; 

      const settingsData = {
        daily_goal: habitData.dailyGoal,
        preferred_hour: habitData.preferredTime,
        custom_color: habitData.customColor,
        commitment_level: habitData.commitmentLevel.replace(/\s\(.*?\)/, '')
    };

      try {
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token,
              },
              body: JSON.stringify(settingsData),
          });
          console.log('habitData:', settingsData);
          if (response.ok) {
              window.location.href = '/myhabits'
              
          }

          const responseData = await response.json();
          console.log('Success:', responseData);

      } catch (error) {
          console.error('Error:', error);
      }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'dailyGoal') {
        formattedValue = parseInt(value, 10);
    }
    setHabitData(prevState => ({
        ...prevState,
        [name]: formattedValue
    }));
};


    useEffect(() => {
        async function fetchHabitInfo() {
            if (!habitId || !token) return;
            const response = await fetch(`https://forge-habits.vercel.app/api/habits/habit/${habitId}/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const data = await response.json();
            setHabitInfo(data);
        }

        async function fetchHabitUnit() {
            if (!habitId || !token) return;
            const response = await fetch(`https://forge-habits.vercel.app/api/habits/habit/${habitId}/unit`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const data = await response.json();
            setHabitUnit(data);
        }

        fetchHabitInfo();
        fetchHabitUnit();
    }, [habitId, token]);

    
    const commitmentLevels = ['Bueno (Forjarlo 1 vez)', 'Superior (Forjarlo 2 veces)', 'Interiorizado (Forjarlo 3 veces)'];

    const options = habitUnit ? getOptions(habitUnit.goals) : [];
    
    function getOptions (goals) {
        let optionsArray = [];
        if (goals && goals.min !== undefined && goals.max !== undefined && goals.increment !== undefined) {
            for (let value = goals.min; value <= goals.max; value += goals.increment) {
                optionsArray.push(value.toFixed(1));
            }
        }
        return optionsArray;
    };

    return (
        <div className="flex flex-col items-center border max-w-2xl mx-auto bg-gray-800 text-white rounded-xl shadow-xl p-6 min-h-screen mt-3 mb-3">
            <div className={`flex items-center space-x-4 mb-10 bg-${habitInfo && habitInfo.default_color}-500 rounded-2xl p-2`}>
                <span className={`material-symbols-outlined rounded-full text-5xl font-bold`}>
                    {habitInfo && habitInfo.material_icon}
                </span>
                <div className="text-3xl font-bold uppercase">{habitInfo && habitInfo.name}</div>
            </div>

            <div className="bg-gray-700 text-white max-w-4xl w-full rounded-xl p-6 md:p-20">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    {habitUnit && habitUnit.goals ? (
                        <Tooltip content="Selecciona un objetivo diario razonable a cumplir cada día.">
                            <div className="flex flex-col md:flex-row items-center mb-4">
                                <label htmlFor="daily-goal" className="flex-1 font-bold mb-2 md:mb-0 md:mr-1 text-md md:text-xl">
                                    Objetivo diario:
                                </label>
                                <select id="daily-goal" name="dailyGoal" className="flex-1 bg-gray-900 text-white rounded py-2 px-4 border border-gray-600" onChange={handleChange}>
                                    <option value="">Selecciona una opción</option>
                                    {options.map((option) => (
                                        <option key={option} value={option}>
                                            {option} {habitUnit.unit}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Tooltip>
                    ) : (
                        <p className="text-center text-gray-400"></p>
                    )}

                    <Tooltip content="Selecciona tu nivel de compromiso. Forjar el hábito 1 vez son 21 días seguidos.">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <label htmlFor="commitment-level" className="flex-1 font-bold mb-2 md:mb-0 md:mr-4 text-md md:text-xl">
                                Nivel de compromiso:
                            </label>
                            <select id="commitment-level" name="commitmentLevel" className="w-full flex-1 bg-gray-900 text-white rounded py-2 px-4 border border-gray-600" onChange={handleChange}>
                                {commitmentLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Tooltip>

                    {habitInfo && habitInfo.programmable && (
                        <Tooltip content="Selecciona tu hora preferida para realizar el hábito.">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                <label htmlFor="preferred-time" className="flex-1 font-bold mb-2 md:mb-0 md:mr-4 text-md md:text-xl">
                                    Hora/s preferida del día:
                                </label>
                                <input id="preferred-time" name="preferredTime" type="time" defaultValue="13:00" className="flex-1 bg-gray-900 text-white rounded py-2 px-4 border border-gray-600" onChange={handleChange} />
                            </div>
                        </Tooltip>
                    )}

                    {error && (
                        <p className="flex items-center text-red-600 text-base sm:text-lg italic justify-center">
                            <span className="material-symbols-outlined text-md mr-2">
                                error
                            </span>
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-2 mt-1">
                        <button type="reset" className="bg-red-400 hover:bg-red-700 text-white rounded py-2 px-4 focus:outline-none font-semibold">
                            Reestablecer
                        </button>
                        <button type="submit" className="bg-orange-400  hover:bg-orange-700 text-white rounded py-2 px-4 focus:outline-none font-semibold">
                            Definir nuevo hábito
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CustomizeHabitComponent;


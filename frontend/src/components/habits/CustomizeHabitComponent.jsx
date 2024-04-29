import { useEffect, useState } from 'react';

const CustomizeHabitComponent = ({ habitId }) => {
    const [habitInfo, setHabitInfo] = useState(null);
    const [habitUnit, setHabitUnit] = useState(null);

    const token = sessionStorage.getItem('jwtToken');

    const [habitData, setHabitData] = useState({
      dailyGoal: 0,
      commitmentLevel: 'Bueno',
      preferredTime: '12:00',
      customColor: 'red'
    });

  const handleSubmit = async (event) => {
      event.preventDefault(); 
      const apiUrl = `http://localhost:3000/api/habits/habit/${habitId}`; 

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

        async function fetchHabitUnit() {
            if (!habitId || !token) return;
            const response = await fetch(`http://localhost:3000/api/habits/habit/${habitId}/unit`, {
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
        <div className="flex flex-col items-center border-2 bg-gray-800 text-white rounded-xl shadow-xl p-6 min-h-screen mt-3 mb-3">
            <div className="flex items-center space-x-4 mb-4">
                <div className={`rounded-full bg-${habitInfo && habitInfo.default_color}-500 p-2 border-2`}>
                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-3xl font-bold uppercase">{habitInfo && habitInfo.name}</div>
            </div>
    
            <div className="bg-gray-300 text-black max-w-4xl rounded-lg p-20">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              {habitUnit && habitUnit.goals ? (
                  <div className="flex md:flex-row items-center mb-4">
                      <label htmlFor="daily-goal" className="flex-1 font-bold mb-2 md:mb-0 md:mr-1">
                          Objetivo diario:
                      </label>
                      <select id="daily-goal" name="dailyGoal" className="flex-1 bg-gray-800 text-white rounded py-2 px-4" onChange={handleChange}>
                          {options.map((option) => (
                              <option key={option} value={option}>
                                  {option} {habitUnit.unit}
                              </option>
                          ))}
                      </select>
                  </div>
              ) : (
                  <p className="text-center text-gray-300"></p>
              )}

              <div className="flex md:flex-row justify-between items-center mb-4">
                  <label htmlFor="commitment-level" className="flex-1 font-bold mb-2 md:mb-0 md:mr-4">
                      Nivel de compromiso:
                  </label>
                  <select id="commitment-level" name="commitmentLevel" className="w-full flex-1 bg-gray-800 text-white rounded py-2 px-4" onChange={handleChange}>
                      {commitmentLevels.map((level) => (
                          <option key={level} value={level}>
                              {level}
                          </option>
                      ))}
                  </select>
              </div>

              {habitInfo && habitInfo.programmable && (
                  <div className="flex md:flex-row justify-between items-center mb-4">
                      <label htmlFor="preferred-time" className="flex-1 font-bold mb-2 md:mb-0 md:mr-4">
                          Hora/s preferida del día:
                      </label>
                      <input id="preferred-time" name="preferredTime" type="time" defaultValue="13:00" className="flex-1 bg-gray-800 text-white rounded py-2 px-4" onChange={handleChange} />
                  </div>
              )}

            <div className="flex md:flex-row items-center mb-4">
                <label htmlFor="custom-color" className="flex-1 font-bold mb-2 md:mb-0 md:mr-4">
                    Color personalizado:
                </label>
                <input id="custom-color" name="customColor" type="text" className="flex-1 bg-gray-800 text-white rounded py-2 px-4" onChange={handleChange} value={habitData.customColor} />
            </div>

              <div className="flex justify-center gap-2">
                  <button type="reset" className="bg-red-500 hover:bg-red-700 text-white rounded py-2 px-4 focus:outline-none">
                      Reestablecer
                  </button>
                  <button type="submit" className="bg-green-500 hover:bg-green-400 text-white rounded py-2 px-4 focus:outline-none">
                      Definir nuevo hábito
                  </button>
              </div>
          </form>

            </div>
          </div>
    );
}

export default CustomizeHabitComponent;


import { useState, useEffect } from 'react';
import HabitComponent from './HabitComponent';

const HabitsDisplayComponent = ({page}) => {
    const [habits, setHabits] = useState([]);

    const token = sessionStorage.getItem('jwtToken');
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const call = page === 'myhabits'
                    ? 'https://forge-habits.vercel.app/api/habits/user'
                    : 'https://forge-habits.vercel.app/api/habits';
                const response = await fetch(call, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token, 
                    }
                });

                const data = await response.json();
                setHabits(data);
            } catch (error) {
                console.error('Error fetching habits:', error);
            }
        };

        fetchHabits();
    }, []); 

    return (
        <div className="min-h-screen animate-fade-right bg-gray-800">
            <div className="flex flex-wrap justify-center gap-4 p-4">
                {habits.map((habit) => (
                    <div key={habit.id} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'> 
                        <HabitComponent
                            title={habit.name}
                            streak={habit.current_streak}
                            bgcolor={habit.default_color}
                            textcolor={habit.text_color}
                            page={page}
                            habitId={habit.id}
                            icon={habit.material_icon}
                            compact={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HabitsDisplayComponent;

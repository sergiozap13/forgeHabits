import React, { useState, useEffect } from 'react';
import HabitComponent from './HabitComponent';

const HabitsDisplayComponent = ({page}) => {
    const [habits, setHabits] = useState([]);

    const token = sessionStorage.getItem('jwtToken');
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const call = page === 'myhabits'
                    ? 'http://localhost:3000/api/habits/user'
                    : 'http://localhost:3000/api/habits';
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
        <div className="min-h-screen mt-3 animate-fade-right">
    <div className="flex flex-wrap justify-center gap-4 p-4">
        {habits.map((habit) => (
            <div key={habit.id} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'> 
                <HabitComponent
                    title={habit.name}
                    streak={habit.current_streak}
                    bgcolor={habit.default_color}
                    page={page}
                    habitId={habit.id}
                />
            </div>
        ))}
    </div>
</div>
    );
};

export default HabitsDisplayComponent;

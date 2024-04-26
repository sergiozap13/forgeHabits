import React from 'react';

const HabitComponent = ({ title, streak, bgcolor }) => {
    return (
        <div className='flex flex-col border-2 rounded-md'>
            <h1 className='text-center'>{title}</h1>
            <div>
                <p className='text-center'>Streak: {streak}</p>
                <button className=''>+ Info</button>
            </div>
        </div>
    );
};

export default HabitComponent;
import React, { useState } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';

const WeeklyCalendarComponent = () => {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [selectedDay, setSelectedDay] = useState(null);

    const nextWeek = () => {
        setCurrentWeek(addWeeks(currentWeek, 1));
    };

    const prevWeek = () => {
        setCurrentWeek(subWeeks(currentWeek, 1));
    };

    const selectDay = (day) => {
        setSelectedDay(day);
    };

    const daysOfWeek = Array.from({ length: 7 }, (_, index) => addDays(currentWeek, index));

    return (
        <div className="h-screen bg-gray-100 p-6 rounded-2xl">
            <div className='flex bg-white shadow-md justify-center rounded-lg mx-auto py-4 px-2 md:mx-12 mb-10'>
                <button onClick={prevWeek} className="mx-2 px-4 rounded hover:bg-orange-300 flex items-center justify-center text-black">
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                </button>
                {daysOfWeek.map(day => (
                    <div key={day} 
                         onClick={() => selectDay(day)}
                         className={`flex group rounded-full mx-1 transition-all duration-300 cursor-pointer justify-center w-16 
                                     ${selectedDay && format(day, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd') ? 'bg-orange-300' : 'hover:bg-orange-200'}`}>
                        <div className='flex items-center px-4 py-4'>
                            <div className='text-center'>
                                <p className='text-gray-900 group-hover:text-black text-sm transition-all group-hover:font-semibold duration-300'>
                                    {format(day, 'eee')}
                                </p>
                                <p className='text-gray-900 group-hover:text-black mt-3 group-hover:font-bold transition-all duration-300'>
                                    {format(day, 'dd')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                
                <button onClick={nextWeek} className="mx-2 px-4 py-2 rounded hover:bg-orange-300 flex items-center justify-center text-black">
                    <span className="material-symbols-outlined">
                        arrow_forward
                    </span>
                </button>
            </div>
        </div>
    );
}

export default WeeklyCalendarComponent;

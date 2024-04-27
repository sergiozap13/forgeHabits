import React, { useEffect, useState } from 'react';

const HabitDetails = ({ habitId }) => {
    const [habit, setHabit] = useState(null);
    const token = sessionStorage.getItem('jwtToken');

    useEffect(() => {
        async function fetchHabit() {
            if (!habitId || !token) return;

            const response = await fetch(`http://localhost:3000/api/habits/habit/${habitId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });
            const data = await response.json();
            setHabit(data);
        }

        fetchHabit();
    }, [habitId]);

    return (
        <div className="text-white p-8">
            <div className="flex flex-col items-center border-2 border-green-700 rounded-xl shadow-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="rounded-full bg-green-700 p-2">
                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold uppercase">Comer saludable</div>
                </div>

                <div className="text-center mb-6">
                    <div className="font-semibold">Categoría: Salud física</div>
                    <div>Estado: {habit && habit.status}</div>
                    <div className="my-2">
                        <span className="font-bold">Racha actual:</span> {habit && habit.current_streak} ( {habit && 21 - habit.current_streak} días para forjar)
                    </div>
                    <div className="my-2">
                        <span className="font-bold">Mejor racha:</span> {habit && habit.best_streak} días
                    </div>
                    <div className="my-2">
                        <span className="font-bold">Tipo:</span> {habit && habit.habit_user_type}
                    </div>
                    <div className="my-2">
                        <span className="font-bold">Veces forjado:</span> {habit && habit.times_forged} (Objetivo: 5)
                    </div>
                </div>

                <div className="bg-green-800 p-4 rounded-lg w-full mb-6">
                    <div className="font-bold text-xl mb-3">TIPS</div>
                    <div className="flex justify-around">
                        <div className="border-2 border-green-700 p-2 rounded-lg">No le eches más de 10 gr de sal a la comida</div>
                        <div className="border-2 border-green-700 p-2 rounded-lg">Si te entra la ansiedad, come una fruta en vez de ese turrón que te encanta</div>
                    </div>
                </div>

                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                    Eliminar
                </button>
            </div>
        </div>
    );
}

export default HabitDetails;

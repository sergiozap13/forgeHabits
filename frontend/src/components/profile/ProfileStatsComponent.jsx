
import React, { useEffect, useState } from 'react';
import Tooltip from '../tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';

const ProfileStatsComponent = ({token}) => {
    
    const [bestHabit, setBestHabit] = useState(null)
    const [forgedHabitsSum, setForgedHabitsSum] = useState(0)
    const [userPerformance, setUserPerformance] = useState(null)

    const getBestHabit = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/stats/best', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            setBestHabit(data)
        } catch (error) {
            console.error('Error fetching best habit:', error)
        }
    }

    const getForgedHabitsSum = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/stats/forged', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            setForgedHabitsSum(data.total_times_forged)
        } catch (error) {
            console.error('Error fetching forged habits:', error)
        }
    }

    const getUserPerformance = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/stats/performance', {
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

    useEffect(() => {
        getBestHabit(),
        getForgedHabitsSum(),
        getUserPerformance()
    }, [])

    return(
        <div className="p-4 max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-md space-y-4 border-2 border-gray-300">
            <h1 className=' text-2xl md:text-3xl font-bold m-2 text-center text-white'>Estadísticas</h1>
            <section className="space-y-4">
                <div className="flex flex-row items-center p-4 m-2 border-2 border-orange-400 rounded-xl bg-gray-700 text-white">
                    <span className="material-symbols-outlined text-4xl md:text-6xl text-orange-300 mr-5">{bestHabit?.icon}</span>
                    <div className="flex flex-col items-center justify-center w-full text-center md:mr-20">
                        <Tooltip content="Este es el hábito que mejor estás llevando ahora mismo">
                            <h2 className="text-xl font-bold mb-2 text-orange-400">Mejor hábito</h2>
                        </Tooltip>
                        <div className='font-semibold'>
                            <p className="font-bold text-lg">{bestHabit?.habit_name}</p>
                            <span className='text-md'>Racha actual: <span className='text-orange-300 text-lg'>{bestHabit?.current_streak}</span></span>

                        </div>
                    </div>
                </div>

                <div className="flex flex-col p-4 m-2 border-2 border-orange-400 rounded-xl bg-gray-700 text-center text-white">
                    <div className='flex justify-center items-center'>
                        <span class="material-symbols-outlined mr-5 mb-1 text-3xl text-orange-100"> swords </span>
                        <Tooltip content="Este es el total de veces que has forjado hábitos">
                            <h2 className="text-xl font-bold mb-2 text-orange-400">Hábitos forjados</h2>
                        </Tooltip>
                        <span class="material-symbols-outlined ml-5 mb-1 text-3xl text-orange-100"> swords </span>
                    </div>
                    <p className='font-semibold text-2xl'>{forgedHabitsSum}</p>
                </div>
                <div className="flex flex-col p-6 m-2 border-2 border-orange-400 rounded-xl bg-gray-700 text-center text-white shadow-lg">
                    <Tooltip content="Este es tu rendimiento actual en la aplicación: Hábitos completados vs Todos los que podías haber completado">
                        <h2 className="text-xl font-bold mb-2 text-orange-400">Rendimiento</h2>
                    </Tooltip>
                    <p className="font-semibold mb-2">{userPerformance?.completed} / {userPerformance?.total} completados ({userPerformance?.percentage}%)</p>
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-orange-100 rounded-lg h-6 m-auto relative overflow-hidden">
                        <div
                            className="bg-orange-500 h-6 rounded-lg transition-all duration-500 ease-out flex items-center justify-center"
                            style={{ width: `${userPerformance?.percentage}%` }}
                        >
                            <span className="text-white text-xs sm:text-sm md:text-base font-bold">{userPerformance?.percentage}%</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProfileStatsComponent;
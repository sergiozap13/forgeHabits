
const ProfileStatsComponent = () => {
    
    return(
        <div className="p-4 max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-md space-y-4 border-2 border-gray-300">
            <h1 className='text-3xl font-bold m-2 text-center text-white'>Estadísticas</h1>
            <section className="space-y-4">
                <div className="flex flex-col p-4 m-2 border-2 border-orange-400 rounded-xl bg-gray-700 text-center text-white">
                    <h2 className="text-xl font-bold mb-2">Mejor hábito</h2>
                    <span>Lectura - Racha actual: 10</span>
                </div>
                <div className="flex flex-col p-4 m-2 border-2 border-orange-400 rounded-xl bg-gray-700 text-center text-white">
                    <h2 className="text-xl font-bold mb-2">Hábitos forjados</h2>
                    <span>1</span>
                </div>
                <div className="flex flex-col p-4 m-2 border-2 border-orange-400 rounded-xl bg-gray-700 text-center text-white">
                    <h2 className="text-xl font-bold mb-2">Rendimiento</h2>
                    <span>10 / 10 completados (100%)</span>
                </div>
            </section>
        </div>
    )
}

export default ProfileStatsComponent;
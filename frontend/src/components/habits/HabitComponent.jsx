const HabitComponent = ({ title, streak, bgcolor, page }) => {
    return (
        <div className={`flex flex-col border-2 ml-4 rounded-xl shadow-md bg-${bgcolor}-500 p-4 hover:bg-${bgcolor}-600 transition-colors duration-300`}>
            <h1 className='text-center font-bold text-xl text-gray-900 p-6'>{title}</h1>
            <div className="flex flex-col items-center py-4">
                {page !== 'habits' && (
                    <p className='font-semibold text-gray-900'>Racha actual: 
                        <span className='font-bold text-white'> {streak} </span>
                    </p>
                )}
                <button className={`border-2 border-gray-700 w-24 mt-4 mb-4 rounded bg-orange-500 text-white py-2 hover:bg-orange-600 transition-colors duration-300`}>
                    {page === 'habits' ? 'Configurar' : '+ Info'}
                </button>
            </div>
        </div>
    );
};

export default HabitComponent;
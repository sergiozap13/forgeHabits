const HabitComponent = ({ title, streak, bgcolor, textcolor, page, habitId }) => {
    return (
        <div className={`flex flex-col border-2 rounded-xl shadow-xl bg-${bgcolor}-500 p-3 transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl transform`}>
            <h1 className='text-center font-bold text-xl text-gray-900 p-6 shadow-text'>
                {title}
            </h1>
            <div className="flex flex-col items-center py-4">
                {page !== 'habits' && (
                    <p className={`font-semibold text-${textcolor} shadow-text`}>Racha actual: 
                        <span className='font-bold'> {streak} </span>
                    </p>
                )}
                <a 
                    href={page === 'myhabits' ? `/habits/${habitId}` : `/customize/${habitId}`} 
                    style={{
                        background: 'linear-gradient(to right top, rgb(251, 146, 60), rgb(251, 113, 133))'
                    }}
                    className="relative border-2 border-gray-700 w-32 mt-4 mb-4 rounded-lg text-white font-bold py-2 shadow-lg transition ease-in-out duration-200 block text-center hover:scale-95 hover:shadow-2xl"
                >
                    {page === 'habits' ? 'Configurar' : '+ Info'}
                </a>

            </div>
        </div>
    );
};

export default HabitComponent;

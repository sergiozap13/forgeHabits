const HabitComponent = ({ title, streak, bgcolor, textcolor, page, habitId, icon, compact }) => {
    const containerStyles = compact ? 
        `flex flex-col border-2 border-black rounded-lg shadow bg-${bgcolor} p-2 transform transition-transform duration-300 ease-in-out hover:scale-105` :
        `flex flex-col border-2 border-black rounded-xl shadow-xl bg-${bgcolor} p-3 transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl transform`;

    const titleStyles = compact ? 
        'text-center font-bold text-xs lg:text-lg md:text-md  text-gray-900 m-1 md:p-3' : 
        'text-center font-bold text-xl text-gray-900 p-3 shadow-text';

    const streakStyles = compact ? 
        `font-semibold text-${textcolor} shadow-text text-xs md:text-md lg:text-lg` : 
        `font-semibold text-${textcolor} shadow-text text-lg`;

    return (
        <div className={containerStyles}>
            <div className="flex items-center justify-center">
                <span className='material-symbols-outlined text-3xl md:text-5xl text-black hover:scale-110 transition 500'>{icon}</span> 
                <h1 className={titleStyles}>
                    {title}
                </h1>
            </div>
            
            <div className="flex flex-col items-center py-2">
                {page !== 'habits' && (
                    <div className="flex items-center justify-center space-x-4">
                        <span class="material-symbols-outlined md:text-3xl text-black mb-1">
                            local_fire_department
                        </span>
                        <p className={streakStyles}>Racha actual: 
                            <span className='font-bold'> {streak} </span>
                        </p>
                    </div>
                )}
                {!compact && (  
                    <a 
                        href={page === 'myhabits' ? `/habits/${habitId}` : `/customize/${habitId}`} 
                        className="border border-black mt-5 mb-2 rounded-lg text-black font-semibold px-4 py-2 text-md shadow-lg shadow-gray-700 bg-orange-200 transition ease-in-out duration-200 hover:scale-105 text-center" 
                    >
                        {page === 'habits' ? 'Configurar' : '+ Info'}
                    </a>
                )}
            </div>
        </div>
    );
};

export default HabitComponent;

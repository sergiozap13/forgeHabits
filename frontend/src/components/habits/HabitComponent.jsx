const HabitComponent = ({ title, streak, bgcolor, textcolor, page, habitId, compact }) => {
    const containerStyles = compact ? 
        `flex flex-col border rounded-lg shadow bg-${bgcolor}-500 p-2 transform transition-transform duration-300 ease-in-out hover:scale-105` :
        `flex flex-col border-2 rounded-xl shadow-xl bg-${bgcolor}-500 p-3 transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl transform`;

    const titleStyles = compact ? 
        'text-center font-bold text-md text-gray-900 p-3' : 
        'text-center font-bold text-xl text-gray-900 p-6 shadow-text';

    const streakStyles = compact ? 
        `font-semibold text-${textcolor} text-sm` : 
        `font-semibold text-${textcolor} shadow-text`;

    const buttonStyles = compact ? 
        "border border-gray-700 w-24 mt-2 mb-2 rounded text-white font-bold py-1 text-xs shadow transition ease-in-out duration-200 block text-center hover:scale-95" :
        "relative border-2 border-gray-700 w-32 mt-4 mb-4 rounded-lg text-white font-bold py-2 shadow-lg transition ease-in-out duration-200 block text-center hover:scale-95 hover:shadow-2xl";

    return (
        <div className={containerStyles}>
            <h1 className={titleStyles}>
                {title}
            </h1>
            <div className="flex flex-col items-center py-2">
                {page !== 'habits' && (
                    <p className={streakStyles}>Racha actual: 
                        <span className='font-bold'> {streak} </span>
                    </p>
                )}
                {!compact && (  
                    <a 
                        href={page === 'myhabits' ? `/habits/${habitId}` : `/customize/${habitId}`} 
                        style={{
                            background: 'linear-gradient(to right top, rgb(251, 146, 60), rgb(251, 113, 133))'
                        }}
                        className={buttonStyles}
                    >
                        {page === 'habits' ? 'Configurar' : '+ Info'}
                    </a>
                )}
            </div>
        </div>
    );
};

export default HabitComponent;


const ProfileSettingsButtons = () => {
    return(
        <div className="flex space-x-2">
            <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                <span className="material-symbols-outlined">
                    settings
                </span>
            </button>
            <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                <span className="material-symbols-outlined">
                    security
                </span>
            </button>
            <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                <span className="material-symbols-outlined">
                    password
                </span>
            </button>
            <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                <span className="material-symbols-outlined">
                    delete_forever
                </span>
            </button>
        </div>
    )
}

export default ProfileSettingsButtons
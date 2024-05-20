import Tooltip from '../tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';


const ProfileSettingsButtons = () => {
    return(
        <div className="flex space-x-2">
            <Tooltip content="Configuración">
                <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                    <span className="material-symbols-outlined">
                        settings
                    </span>
                </button>
            </Tooltip>
            <Tooltip content="Seguridad y privacidad">
                <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                    <span className="material-symbols-outlined">
                        security
                    </span>
                </button>
            </Tooltip>
            <Tooltip content="Cambiar contraseña">
                <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                    <span className="material-symbols-outlined">
                        password
                    </span>
                </button>
            </Tooltip>
            <Tooltip content="Eliminar cuenta">
                <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                    <span className="material-symbols-outlined">
                        delete_forever
                    </span>
                </button>
            </Tooltip>
        </div>
    )
}

export default ProfileSettingsButtons
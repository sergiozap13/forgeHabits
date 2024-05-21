import Tooltip from '../tooltip/Tooltip.jsx';
import 'tippy.js/dist/tippy.css';


const ProfileSettingsButtons = () => {
    return(
        <div className="flex space-x-2">
            <Tooltip content="Configuración">
                <a href="/settings" className="bg-gray-800 hover:bg-gray-800 text-white font-bold p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                    <span className="material-symbols-outlined">
                        settings
                    </span>
                </a>
            </Tooltip>
            
        </div>
    )
}

export default ProfileSettingsButtons
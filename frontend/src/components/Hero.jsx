import landing from '../assets/landing.png';

function Hero() {

    return (    
        <section className="md:pt-24 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in">
            <div className="md:px-12 mx-auto max-w-8xl">
                <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
                    <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight text-center">
                        <span className="text-gray-200 ">¿Quieres</span> <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-orange-600 to-gray-200 lg:inline"> conseguir que tus hábitos sean duraderos?</span>
                    </h1>
                    <p className="px-0 mb-8 text-lg text-gray-200 md:text-xl lg:px-24 text-center">
                        Empieza a transformar tu vida hoy con nuestra aplicación de seguimiento de hábitos.
                    </p>
                    <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
                        <a href="/register" className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg font-bold text-white bg-orange-500 rounded-2xl sm:w-auto sm:mb-0">
                            Empieza ya
                            <span class="material-symbols-outlined">
                                arrow_forward
                            </span>                        
                        </a>
                    </div>
                </div>
                <div className="w-full mx-auto md:mt-20 text-center md:w-10/12">
                    <div className="relative z-0 w-full mt-8">
                        <div className="relative overflow-hidden shadow-2xl">
                            <div className="flex items-center flex-none px-4 bg-orange-500 rounded-b-none h-11 rounded-xl">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                                </div>
                            </div>
                            <img className="mb-5" src={landing.src}></img>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
     
    

function FeaturesComponent(){
    return (
    <div className="py-5 bg-gray-700 overflow-hidden ">
        <div className="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
            <div>
                <h2 className="text-xl md:text-3xl text-white font-bold text-center ">Una aplicación de <span class="text-orange-200">hábitos</span> con fundamento científico detrás <br className="lg:block" hidden></br></h2>
            </div>

            <div className="mt-10 grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4 bg-gray-600">
                <div className="relative group bg-gray-100 transition hover:z-[1] hover:shadow-2xl lg:hidden xl:block">
                    <div className="relative p-8 space-y-8 transition duration-300 group-hover:bg-white group-hover:border group-hover:scale-90">
                    <span class="material-symbols-outlined text-5xl text-orange-300 group-hover:text-black">
                        local_fire_department
                    </span>
                        
                        <div className="space-y-2">
                            <h5 className="text-xl text-gray-800 font-medium transition group-hover:text-orange-300">Rachas de hábitos</h5>
                            <p className="text-sm text-gray-700">Mantén un seguimiento de tus hábitos diarios y observa cómo pequeñas acciones se convierten en grandes logros.</p>
                        </div>
                    </div>
                </div>
                <div className="relative group bg-gray-100 transition hover:z-[1] hover:shadow-2xl lg:hidden xl:block">
                    <div className="relative p-8 space-y-8 transition duration-300 group-hover:bg-white group-hover:border group-hover:scale-90">
                        <span class="material-symbols-outlined text-5xl text-orange-300 group-hover:text-black">
                            calendar_month
                        </span>
                        
                        <div className="space-y-2">
                            <h5 className="text-xl text-gray-800 font-medium transition group-hover:text-orange-300">Calendario programable</h5>
                            <p className="text-sm text-gray-700">Tus hábitos personalizados ya están configurados para cada día, solo tienes que completarlos.</p>
                        </div>
                    </div>
                </div>
                <div className="relative group bg-gray-100 transition hover:z-[1] hover:shadow-2xl lg:hidden xl:block">
                    <div className="relative p-8 space-y-8 transition duration-300 group-hover:bg-white group-hover:border group-hover:scale-90">
                        <span class="material-symbols-outlined text-5xl text-orange-300 group-hover:text-black">
                            auto_stories
                        </span>
                        
                        <div className="space-y-2">
                            <h5 className="text-xl text-gray-800 font-medium transition group-hover:text-orange-300">Diario</h5>
                            <p className="text-sm text-gray-700">Registra tu progreso y reflexiona sobre tus días con nuestro diario personal.</p>
                        </div>
                    </div>
                </div>
                <div className="relative group bg-gray-100 transition hover:z-[1] hover:shadow-2xl lg:hidden xl:block">
                    <div className="relative p-8 space-y-8 border-dashed rounded-lg transition duration-300 group-hover:bg-white group-hover:border group-hover:scale-90">
                        <span class="material-symbols-outlined text-5xl text-orange-300 font-bold group-hover:text-black">
                            more_horiz
                        </span>
                        
                        <div className="space-y-2">
                            <h5 className="text-xl text-gray-800 font-medium transition group-hover:text-orange-300">Y pronto más...</h5>
                            <p className="text-sm text-gray-700">Seguimos implementando nuevas funcionalidades para mejorar tu experiencia con la aplicación.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

)}

export default FeaturesComponent;
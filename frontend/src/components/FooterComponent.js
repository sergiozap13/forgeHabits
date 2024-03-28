import React from 'react'
import logoText from "../assets/logo-text.svg";

function FooterComponent(){
    const currentYear = new Date().getFullYear();
    return(
        <footer class="p-4 bg-gradient-to-r from-orange-500 to-orange-300 bg-opacity-95 rounded-lg shadow md:px-6 md:py-1">
            <div class="sm:flex sm:items-center sm:justify-between">
                <a href="/" target="_blank" class="flex items-center mb-4 sm:mb-0">
                    <span class="self-center text-xl font-semibold whitespace-nowrap">
                        <img src={logoText} className="" alt="ForgeHabits Logo" width="100" height="100" />
                    </span>
                </a>
                <ul class="flex flex-wrap items-center mb-6 sm:mb-0">
                    <li>
                        <a href="/about-us" class="mr-4 text-sm text-gray-600 hover:underline md:mr-6">Sobre nosotros</a>
                    </li>
                    <li>
                        <a href="/policy" class="mr-4 text-sm text-gray-600 hover:underline md:mr-6">Políticas de privacidad</a>
                    </li>
                    <li>
                        <a href="/contact" class="text-sm text-gray-600  hover:underline ">Contacto</a>
                    </li>
                </ul>
            </div>
            <hr class="my-6 border-gray-700 sm:mx-auto lg:my-2"/>
            <span class="block text-sm text-gray-600 sm:text-center">© {currentYear} <a href="http://localhost:3001/login" target="_blank" class="hover:underline" rel="noreferrer">ForgeHabits</a>. All Rights Reserved.</span>
        </footer>

    )
}

export default FooterComponent;
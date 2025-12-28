window.App = window.App || {};
window.App.Components = window.App.Components || {};

window.App.Components.InstitutionalHeader = () => (
    <header className="hidden md:block absolute top-0 left-0 right-0 z-[1100] transition-all duration-500 ease-in-out bg-[#9d2449] border-b border-[#9d2449] shadow-md group">
        <div className="h-16 md:h-20 flex items-center justify-between px-4 max-w-7xl mx-auto transition-all duration-300">

            {/* Left Section: Branding */}
            <div className="flex items-center gap-3">
                {/* Logo Container: White Pill to ensure visibility of Guinda Logo */}
                <div className="bg-white rounded-lg px-3 py-1 shadow-sm">
                    <img
                        src="./assets/logo-sedema.png"
                        alt="Gobierno de la Ciudad de México - SEDEMA"
                        className="h-10 md:h-14 w-auto max-w-[200px] md:max-w-[400px] object-contain"
                        loading="eager"
                        decoding="async"
                    />
                </div>

                {/* Separator */}
                <div className="h-8 md:h-10 w-px bg-white/30 mx-1 md:mx-3 shadow-sm"></div>

                {/* Titles */}
                <div className="flex flex-col justify-center">
                    {/* Mobile Title */}
                    <h1 className="md:hidden text-sm font-bold text-white leading-tight text-shadow-sm">
                        Consulta Ciudadana
                    </h1>

                    {/* Desktop Title */}
                    <h1 className="hidden md:block text-xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                        Visor de Consulta Ciudadana
                    </h1>

                    {/* Subtitle (Desktop only for space) */}
                    <span className="hidden md:block text-xs text-white/90 font-medium tracking-wide mt-0.5">
                        Consulta normativa de Categorías de Protección Ambiental
                    </span>
                </div>
            </div>

            {/* Right Section: Actions Placeholder */}
            <div className="flex items-center justify-end gap-3 min-w-[40px]">
                {/* Future buttons (Language, Login, etc.) go here */}
            </div>
        </div>
    </header>
);

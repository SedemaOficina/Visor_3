import { useState, useEffect } from 'react';
import Icons from '../ui/Icons';

const OnboardingTour = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);

    const STEPS = [
        {
            title: '¡Bienvenido al Visor Ciudadano!',
            text: 'Esta herramienta te permite consultar el Uso de Suelo y Normatividad de cualquier ubicación en la CDMX de forma fácil y rápida.',
            icon: Icons.MapPin || (() => <span>📍</span>)
        },
        {
            title: 'Paso 1: Busca',
            text: 'Utiliza la barra de búsqueda superior para encontrar una dirección, calle o coordenada específica.',
            icon: Icons.Search || (() => <span>🔍</span>)
        },
        {
            title: 'Paso 2: Explora',
            text: 'O navega por el mapa interactivo. Haz clic sobre cualquier punto para ver su información detallada.',
            icon: Icons.Navigation || (() => <span>👆</span>)
        },
        {
            title: 'Paso 3: Consulta',
            text: 'Obtén un reporte completo de zonificación y descarga la Ficha Informativa en PDF para tus trámites.',
            icon: Icons.FileText || (() => <span>📄</span>)
        }
    ];

    useEffect(() => {
        // Check if already seen (New key to force show for v3.2)
        const seen = localStorage.getItem('tutorial_seen_v3_2');
        if (!seen) {
            // Reduced delay for better responsiveness
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('tutorial_seen_v3_2', 'true');
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            handleDismiss();
        }
    };

    if (!isVisible) return null;

    const currentStep = STEPS[step];
    const StepIcon = currentStep.icon;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-end justify-center sm:justify-end pointer-events-none p-4 sm:p-8">

            <div className="
                pointer-events-auto
                glass-panel rounded-2xl
                w-full max-w-sm
                overflow-hidden
                animate-scale-in
                flex flex-col
                shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                border border-white/40
            ">
                {/* Header Image/Icon Area */}
                <div className="bg-gradient-to-br from-[#9d2148] to-[#7d1d3a] p-5 text-white text-center relative overflow-hidden">
                    {/* Decorative Circle */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>

                    <div className="relative z-10 mx-auto w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm shadow-inner ring-1 ring-white/30">
                        <StepIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="relative z-10 text-lg font-bold leading-tight">{currentStep.title}</h3>
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="text-gray-600 text-sm leading-relaxed text-center mb-5 font-medium">
                        {currentStep.text}
                    </p>

                    {/* Progress */}
                    <div className="flex flex-col items-center gap-2 mb-6">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            Paso {step + 1} de {STEPS.length}
                        </span>
                        <div className="flex justify-center gap-1.5">
                            {STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#9d2148]' : 'w-1.5 bg-gray-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors border border-gray-200 shadow-sm"
                        >
                            Saltar
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#9d2148] hover:bg-[#8a1c3f] rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 border border-transparent"
                        >
                            {step === STEPS.length - 1 ? '¡Listo!' : 'Siguiente'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingTour;

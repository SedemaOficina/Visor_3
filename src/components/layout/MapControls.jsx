import { useState } from 'react';
import Icons from '../ui/Icons';
import Tooltip from '../ui/Tooltip';

const MapControls = ({
    onOpenHelp,
    isLegendOpen,
    setLegendOpen,
    globalOpacity,
    setGlobalOpacity,
    onResetView,
    onUserLocation,
    onZoomIn,
    onZoomOut
}) => {
    const [isFabOpen, setIsFabOpen] = useState(false);

    return (
        <>
            {/* CONTROLS STACK (Top Right) */}
            <div className="absolute top-16 md:top-20 right-4 flex flex-col items-center gap-3 pointer-events-auto z-[1100]">

                {/* 1. Help */}
                <Tooltip content="Ayuda y Tutorial" placement="left">
                    <button
                        type="button"
                        onClick={onOpenHelp}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-[#9d2148] hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="font-bold text-xl leading-none">?</span>
                    </button>
                </Tooltip>

                {/* 2. Layers */}
                <Tooltip content="Capas y Simbología" placement="left">
                    <button
                        onClick={() => setLegendOpen(!isLegendOpen)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md border border-gray-200 transition-all hover:scale-105 active:scale-95 ${isLegendOpen ? 'bg-[#9d2148] text-white border-[#9d2148]' : 'bg-white text-[#9d2148] hover:bg-gray-50'}`}
                    >
                        <Icons.Layers className="h-5 w-5" />
                    </button>
                </Tooltip>

                {/* 3. OPTIONS FAB */}
                <div className="relative flex flex-col items-end">

                    {/* Expanded Menu Items */}
                    <div className={`flex flex-col items-center gap-3 transition-all duration-300 origin-top pt-3 ${isFabOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 -translate-y-4 pointer-events-none absolute top-full right-0 mt-2'}`}>

                        {/* Opacity Slider */}
                        <Tooltip content="Ajustar Opacidad" placement="left">
                            <div className="hidden md:flex flex-col items-center gap-1 bg-white rounded-full shadow-md border border-gray-200 py-2 w-10 h-auto animate-scale-in">
                                <div className="text-[#9d2449] mb-1">
                                    {Icons.Droplet ? <Icons.Droplet className="h-4 w-4" /> : <div className="h-3 w-3 bg-[#9d2449] rounded-full" />}
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="0.45"
                                    step="0.05"
                                    value={globalOpacity || 0.20}
                                    onChange={(e) => setGlobalOpacity(parseFloat(e.target.value))}
                                    className="w-1 h-16 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9d2449] my-1"
                                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                                />
                                <div className="mt-1 px-1 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-[#9d2449] w-full text-center">
                                    {Math.round((globalOpacity || 0.20) * 100)}%
                                </div>
                            </div>
                        </Tooltip>

                        {/* Reset View */}
                        <Tooltip content="Restablecer vista" placement="left">
                            <button
                                onClick={() => { onResetView(); setIsFabOpen(false); }}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-[#9d2148] hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Icons.RotateCcw className="h-5 w-5" />
                            </button>
                        </Tooltip>

                        {/* My Location */}
                        <Tooltip content="Mi Ubicación" placement="left">
                            <button
                                onClick={() => { onUserLocation(); setIsFabOpen(false); }}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-[#9d2148] hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Icons.Navigation className="h-5 w-5" />
                            </button>
                        </Tooltip>
                    </div>

                    {/* FAB Trigger */}
                    <Tooltip content={isFabOpen ? "Cerrar menú" : "Más opciones"} placement="left">
                        <button
                            onClick={() => setIsFabOpen(!isFabOpen)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg border border-gray-200 transition-all duration-300 z-10 hover:scale-105 active:scale-95 ${isFabOpen ? 'bg-gray-800 rotate-90 text-white border-gray-800' : 'bg-[#9d2148] text-white border-[#9d2148]'}`}
                        >
                            {isFabOpen ? <Icons.X className="h-5 w-5" /> : <Icons.Menu className="h-5 w-5" />}
                        </button>
                    </Tooltip>

                </div>
            </div>

            {/* ZOOM CONTROLS (Bottom Right) */}
            <div className="absolute bottom-36 md:bottom-10 right-4 flex flex-col items-center gap-3 z-[1100]">
                <Tooltip content="Acercar" placement="left">
                    <button
                        onClick={onZoomIn}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-[#9d2148] hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </Tooltip>

                <Tooltip content="Alejar" placement="left">
                    <button
                        onClick={onZoomOut}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-[#9d2148] hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </Tooltip>
            </div>
        </>
    );
};

export default MapControls;

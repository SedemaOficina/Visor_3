const { CONTACT_INFO } = window.App.Constants;
const Icons = window.App.Components.Icons;

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9d2148] flex items-center justify-center text-white shadow-sm">
                            <span className="font-bold text-xl">?</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Ayuda y Soporte</h2>
                            <p className="text-xs text-gray-500">Consulta Ciudadana de Zonificación</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <Icons.X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="space-y-8">
                        {/* Sección 1 */}
                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-bold text-[#9d2148] mb-3">
                                <Icons.MapPinned className="h-5 w-5" />
                                ¿Cómo realizar una consulta?
                            </h3>
                            <ul className="space-y-3 pl-2">
                                <li className="flex gap-3 text-sm text-gray-700">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-[#9d2148] font-bold flex items-center justify-center text-xs border border-red-100">1</span>
                                    <span>
                                        <strong>Búsqueda por dirección:</strong> Escribe la calle y número en el buscador lateral (ej. "Av. Insurgentes Sur 100").
                                    </span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-700">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-[#9d2148] font-bold flex items-center justify-center text-xs border border-red-100">2</span>
                                    <span>
                                        <strong>Búsqueda por coordenadas:</strong> Ingresa latitud y longitud (ej. "19.4326, -99.1332").
                                    </span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-700">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-[#9d2148] font-bold flex items-center justify-center text-xs border border-red-100">3</span>
                                    <span>
                                        <strong>Navegación manual:</strong> Navega por el mapa y haz clic directamente sobre el predio de interés.
                                    </span>
                                </li>
                            </ul>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Contacto */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">¿Necesitas más información?</h4>
                                <p className="text-xs text-blue-700">Comunícate a la Dirección General de Ordenamiento Ecológico.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-blue-900">{CONTACT_INFO.phone}</div>
                                <div className="text-[10px] text-blue-700">{CONTACT_INFO.hours}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
                    <button
                        onClick={onClose}
                        className="bg-[#9d2148] text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#7d1d3a] transition-all active:scale-95"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

window.App.Components.HelpModal = HelpModal;

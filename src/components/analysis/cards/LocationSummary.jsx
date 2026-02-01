/* React removed */
import Icons from '../../ui/Icons';
import Tooltip from '../../ui/Tooltip';
import { CONSTANTS } from '../../../utils/constants';
import { getZoningColor } from '../../../utils/geoUtils';
import { getZoningDisplay, getContrastYIQ } from '../../../utils/analysisUtils';
import { isConservationSoil, isUrbanSoil, isOutsideCDMX, hasZoningData } from '../../../utils/domain/zoningRules';

const LocationSummary = ({ analysis, approximateAddress, onExportPDF, isExporting, exportProgress }) => {
    const COLORS = CONSTANTS.COLORS || {};

    const isSC = isConservationSoil(analysis);
    const isUrban = isUrbanSoil(analysis);
    const isOutside = isOutsideCDMX(analysis);
    const hasData = hasZoningData(analysis);

    let zoningColor = '#9ca3af';
    if (analysis.zoningKey === 'ANP') {
        zoningColor = COLORS.anp || '#9333ea';
    } else if (!hasData) {
        zoningColor = '#9ca3af';
    } else if (analysis.zoningKey && getZoningColor) {
        zoningColor = getZoningColor(analysis.zoningKey);
    }

    const zoningBadgeLabel = hasData && analysis.zoningKey !== 'ANP'
        ? getZoningDisplay(analysis)
        : null;

    if (isOutside) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-none animate-slide-up">

            {/* 1. Dirección Aproximada (TOP) */}
            {approximateAddress && (
                <div className="mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-start gap-2">
                        {Icons.MapPin && <div className="mt-0.5 text-[#9d2449]"><Icons.MapPin className="h-3.5 w-3.5" /></div>}
                        <div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                Dirección Aproximada (Orientativa)
                            </div>
                            <div className="text-xs font-semibold text-gray-800 leading-snug">
                                {approximateAddress}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Alcaldía (SECOND) */}
            <div className="mb-3 pb-3 border-b border-gray-100">
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Alcaldía</div>
                <div className="text-lg font-bold text-gray-900 leading-tight">
                    {analysis.alcaldia || 'Ciudad de México'}
                </div>
            </div>

            {/* 3. Badges (THIRD) */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* Badge Suelo Base */}
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase leading-none"
                    style={{
                        backgroundColor: isSC ? COLORS.sc : isUrban ? COLORS.su : '#6b7280',
                        color: '#ffffff'
                    }}
                >
                    {isSC ? 'Suelo de Conservación' : 'Suelo Urbano'}
                </span>

                {/* Badge Zonificación */}
                {zoningBadgeLabel && (
                    <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase leading-none"
                        style={{
                            backgroundColor: zoningColor,
                            color: getContrastYIQ(zoningColor)
                        }}
                    >
                        {zoningBadgeLabel}
                    </span>
                )}

                {/* Badge ANP */}
                {analysis.isANP && (
                    <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase leading-none bg-[#9333ea] text-white"
                    >
                        ANP
                    </span>
                )}
            </div>

            {/* 4. Botones de Acción (BOTTOM) */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3">
                <Tooltip content="Ver ubicación exacta en Google Maps">
                    <a
                        href={analysis.coordinate ? `https://www.google.com/maps/search/?api=1&query=${analysis.coordinate.lat},${analysis.coordinate.lng}` : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-bold text-[10px] md:text-xs shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        {Icons.MapIcon && <Icons.MapIcon className="h-4 w-4 text-blue-500" />}
                        <span>Google Maps</span>
                    </a>
                </Tooltip>

                <Tooltip content="Generar ficha PDF con información oficial preliminar">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isExporting && onExportPDF) onExportPDF(e);
                        }}
                        disabled={isExporting}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-[10px] md:text-xs text-white shadow-sm transition-all active:scale-95
                        ${isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9d2449] hover:bg-[#8a1f40]'}`}
                    >
                        {isExporting ? (
                            <div className="flex items-center gap-2">
                                {Icons.Loader2 ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <div className="h-3 w-3 rounded-full border-2 border-white/50 border-t-white animate-spin" />}
                                <span>{exportProgress ? `${exportProgress}%` : 'Generando...'}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {Icons.Pdf && <Icons.Pdf className="h-4 w-4" />}
                                <span>Descargar Ficha</span>
                            </div>
                        )}
                    </button>
                </Tooltip>
            </div>
        </div >
    );
};

export default LocationSummary;

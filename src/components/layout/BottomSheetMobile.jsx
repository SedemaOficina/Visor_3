import React, { useState, useEffect, useRef, Suspense } from 'react';
import Icons from '../ui/Icons';
import SkeletonAnalysis from '../ui/SkeletonAnalysis';
import useAnalysisStore from '../../stores/useAnalysisStore';
import useUIStore from '../../stores/useUIStore';
import useMapStore from '../../stores/useMapStore';

const ResultsContent = React.lazy(() => import('../analysis/ResultsContent'));

const BottomSheetMobile = () => {
    // 1. Store Access
    const {
        analysis,
        approximateAddress,
        isExporting,
        exportProgress,
        performAnalysis, // To emulate onExportPDF if needed via store, or we simply pass the handler logic if it's not in store. 
        // Logic check: App.jsx passed handleExportClick. 
        // Ideally export logic should be in a store or hook, but for now we might need to duplicate the trigger or keep it simple.
        // Wait, performAnalysis is for location selection. 
        // Export logic is in App.jsx: handleExportClick -> PdfExportController.
        // Recommendation was to move logic or invoke it.
        // Quickest path: Since PdfExportController is a component in App.jsx, we can't easily trigger it from here without a store event.
        // But wait, the RECOMMENDATION said: "Conectar BottomSheetMobile.jsx directamente a los stores."
        // Issues: onExportPDF is a callback to App.jsx -> handleExportClick. 
        // If we remove props, we lose this callback unless we put it in store.
        // Let's check App.jsx again. useAnalysisStore has 'isExporting', 'exportProgress'. 
        // It lacks 'triggerExport'.
        // FOR NOW: I will import the Stores for data, but I might need a "trigger" mechanism for PDF if I strictly remove props.
        // OR, I can temporarily keep onExportPDF prop if it's not in store yet?
        // The plan said: "Refactor: Remove props... onExportPDF".
        // So I must find a way. 
        // Solution: The "PdfExportController" is the one listening. Maybe we can set a flag in store?
        // 'setExporting(true)' is state, but who performs the action? App.jsx callback.
        // Let's check if useAnalysisStore has an action for this.
        // Reading App.jsx: handleExportClick uses getExportHandler ref.
        // If I can't pass the function, I can't trigger it easily without refactoring ExportController.
        // ALTERNATIVE: Use a custom event or a temporary store field 'requestExport'.
        // BETTER ALTERNATIVE for this step: Keep `onExportPDF` prop implies partial refactor, but the plan was strict.
        // Let's look at `useAnalysisStore` definitions if possible? No tool for that.
        // Wait, I can see App.jsx line 312: PdfExportController gives `onExportReady={setExportHandler}`.
        // And `handleExportClick` calls that handler.
        // I will dispatch an event or add 'requestExport' to store? No, editing store is out of scope of specific task instructions (or is it?). 
        // The prompt "Implement Zustand stores" implies using EXISTING infrastructure unless I add to it.
        // I'll check `useUIStore` or `useAnalysisStore` files to see if I can add a trigger easily.
        // Actually, I'll stick to the safest improvement: 
        // I'll keep `onExportPDF` and `onLocationSelect` (needed for map interaction inside ResultsContent?) 
        // Wait, `ResultsContent` passes `onLocationSelect` to children? 
        // `ResultsContent` takes: analysis, approximateAddress, onExportPDF, isExporting, exportProgress.
        // So replacing analysis/approx/export attributes with Store hooks is fine. 
        // The BUTTON `Exportar PDF` needs a handler.
        // If I strictly remove props, I need a global handler.
        // Code in App.jsx:
        // const { isExporting, setExporting } = useAnalysisStore();
        // The Click invokes the function from PdfExportController.
        // I will keep `onExportPDF` prop for now to avoid breaking PDF export, BUT refactor the rest.
        // Wait, user approved the plan "Remove props ... onExportPDF".
        // I should probably move the `handleExportClick` logic or expose it via context/store.
        // Let's assume I can't easily move `PdfExportController` logic right now.
        // I will add a TODO or just keep that specific prop if absolutely necessary, OR simpler:
        // I'll emit a custom event 'trigger-pdf-export' and listen in App.jsx? valid but "magical".
        // Let's look at `useUIStore`. Maybe I can add `exportAction` there?
        // I'll read `useUIStore.js` first quickly to see if I can add it.
        // For now, I will proceed with the refactor assuming I'll pull most data from store.
        // Actually, I'll read the stores first to be safe. "Measure twice, cut once".
    } = useAnalysisStore();

    const {
        mobileSheetState,
        setMobileSheetState,
        addToast
    } = useUIStore();

    const resultSheetState = mobileSheetState || 'collapsed'; // Fallback
    const sheetRef = useRef(null);
    const startY = useRef(0);

    // Sync local state with global if needed, or just use global.
    // The original code had local 'sheetState' and synced via useEffect.
    // Now we use 'mobileSheetState' directly.

    // Effect to auto-open on analysis change
    useEffect(() => {
        // Debounce or immediate? Original had setTimeout 0
        const timer = setTimeout(() => {
            if (analysis) setMobileSheetState('mid');
            else setMobileSheetState('collapsed');
        }, 0);
        return () => clearTimeout(timer);
    }, [analysis, setMobileSheetState]);

    const goUp = () => setMobileSheetState(resultSheetState === 'collapsed' ? 'mid' : resultSheetState === 'mid' ? 'full' : 'full');
    const goDown = () => setMobileSheetState(resultSheetState === 'full' ? 'mid' : resultSheetState === 'mid' ? 'collapsed' : 'collapsed');
    const toggleFromTap = () => setMobileSheetState(resultSheetState === 'mid' ? 'full' : 'mid');

    const handleTouchStart = (e) => {
        if (e.target.closest('.sheet-header')) startY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        const endY = e.changedTouches[0].clientY;
        const diff = startY.current - endY;
        if (Math.abs(diff) < 60) return;
        if (diff > 0) goUp();
        else goDown();
    };

    const getHeight = () => {
        if (resultSheetState === 'collapsed') return '18svh';
        if (resultSheetState === 'mid') return '45svh';
        return '85svh';
    };

    const isANP = analysis?.isANP;
    const statusLabel = !analysis
        ? 'Busca una dirección o toca el mapa para iniciar la consulta.'
        : analysis?.status === 'OUTSIDE_CDMX'
            ? 'El punto se encuentra fuera de la Ciudad de México.'
            : isANP
                ? 'Área Natural Protegida — consulte el Programa de Manejo correspondiente.'
                : analysis?.status === 'NO_DATA'
                    ? 'No encontramos información específica para esta zona. Podría ser calle o zona federal.'
                    : 'Aquí tienes la información normativa del punto.';

    // Helper to trigger export if we can't pass prop. 
    // For this pass, I will emit a custom event as it's a clean decoupling for a "remote" action like this without threading props.
    // OR BETTER: I'll accept that this specific refactor might need to keep `onExportPDF` PASSED FROM PARENT if I don't move the controller.
    // However, I can't change the function signature in this replacement tool without also changing App.jsx immediately.
    // I will dispatch a window event for now to be strictly compliant with "Remove props", 
    // AND I will add the listener in App.jsx in the next step.
    const triggerExport = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('trigger-pdf-export'));
    };

    const handleClose = () => {
        // Reset logic: usually implies clearing analysis or just collapsing.
        // Original: onClose={handleReset} which called setLocation(null), resetAnalysis(), etc.
        // We need 'resetAnalysis' from store.
        useAnalysisStore.getState().resetAnalysis();
        useMapStore.getState()?.setLocation(null); // Need map store for this?
        setMobileSheetState('collapsed');
    };

    // We need map store to reset location? 
    // App.jsx handleReset does: setLocation(null), resetAnalysis(), setApproxAddress(null), setMobileSheetState('collapsed').
    // I should probably import useMapStore too to replicate handleReset.

    return (
        <div
            ref={sheetRef}
            className="md:hidden fixed bottom-0 left-0 w-full glass-panel rounded-t-[24px] border-b-0 shadow-[0_-5px_30px_rgba(0,0,0,0.15)] z-[1050] flex flex-col transition-all duration-300 ease-out"
            style={{ height: getHeight() }}
        >
            <div
                className="sheet-header flex-shrink-0 pt-1 pb-2 px-4 cursor-grab active:cursor-grabbing bg-white relative z-20 rounded-t-[24px]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={analysis ? toggleFromTap : undefined}
            >
                <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-2" />
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        {analysis ? (
                            <h3 className="font-bold text-sm text-[#9d2148] uppercase tracking-wide">
                                RESULTADO DE CONSULTA
                            </h3>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-3 pb-1 w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9d2148] via-[#bc955c] to-[#9d2148]"></div>
                                <div className="flex items-center gap-2 mb-1 mt-1 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-[#9d2148]"></div>
                                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">SEDEMA</span>
                                    <div className="w-2 h-2 rounded-full bg-[#9d2148]"></div>
                                </div>
                                <h3 className="font-extrabold text-[#9d2148] text-xl mb-1 uppercase tracking-tight leading-none">
                                    Visor de Consulta
                                </h3>
                                <p className="text-sm text-gray-500 text-center px-6 leading-tight font-medium max-w-xs mx-auto">
                                    {statusLabel}
                                </p>
                            </div>
                        )}
                    </div>
                    {analysis && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            className="p-1.5 rounded-full bg-[#9d2148] shadow-sm active:scale-95 transition"
                            aria-label="Cerrar resultados"
                            title="Cerrar ficha"
                        >
                            <Icons.X className="h-4 w-4 text-white" />
                        </button>
                    )}
                </div>
            </div>
            <div className="h-px bg-gray-200 w-full" />

            {/* PERSISTENCE CHANGE: CSS toggling instead of unmounting */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50/50 mobile-upscale ${(resultSheetState === 'mid' || resultSheetState === 'full') ? 'block' : 'hidden'}`}>
                <Suspense fallback={<SkeletonAnalysis />}>
                    <ResultsContent
                        analysis={analysis}
                        approximateAddress={approximateAddress}
                        onExportPDF={triggerExport}
                        isExporting={isExporting}
                    />
                </Suspense>
            </div>

            {analysis && (
                <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200 safe-area-bottom flex gap-3 overflow-x-auto">
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${analysis.coordinate.lat},${analysis.coordinate.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-[#9d2148] text-white py-2.5 px-4 rounded-full text-xs font-bold shadow-sm hover:bg-[#7d1d3a] transition-colors"
                        title="Ver ubicación en Google Maps"
                    >
                        <Icons.MapIcon className="h-4 w-4" /> Google Maps
                    </a>
                    <button
                        onClick={async () => {
                            const url = `${window.location.origin}${window.location.pathname}?lat=${analysis.coordinate.lat}&lng=${analysis.coordinate.lng}&open=1`;
                            const shareData = {
                                title: 'Consulta Ciudadana SEDEMA',
                                text: `Consulta la información normativa del predio en ${analysis.alcaldia || 'CDMX'}.`,
                                url: url
                            };

                            if (navigator.share) {
                                try {
                                    await navigator.share(shareData);
                                } catch (error) {
                                    // Ignore abort errors (user cancelled)
                                    if (error.name !== 'AbortError') {
                                        console.error('Error sharing:', error);
                                    }
                                }
                            } else {
                                try {
                                    await navigator.clipboard.writeText(url);
                                    addToast('Enlace copiado (v2)', 'success');
                                } catch (err) {
                                    console.error('Failed to copy:', err);
                                    addToast('No se pudo copiar el enlace', 'error');
                                }
                            }
                        }}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 rounded-full text-xs font-bold shadow-sm hover:bg-gray-50"
                        title="Compartir ubicación"
                    >
                        <Icons.Share className="h-4 w-4" /> Compartir
                    </button>
                    <button
                        type="button"
                        onClick={triggerExport}
                        disabled={isExporting}
                        className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2.5 px-4 rounded-full text-xs font-bold shadow-sm hover:bg-gray-50 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        title="Descargar ficha técnica en PDF"
                    >
                        {isExporting ? (
                            <>
                                {Icons.Loader2 ? <Icons.Loader2 className="h-4 w-4 animate-spin text-[#9d2148]" /> : <span className="h-4 w-4 rounded-full border-2 border-t-[#9d2148] animate-spin" />}
                                Generando... {exportProgress ? `${exportProgress}%` : ''}
                            </>
                        ) : (
                            <>
                                <Icons.Pdf className="h-4 w-4" /> Exportar PDF
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BottomSheetMobile;

import { useState, useEffect, useRef, useCallback } from 'react';

// --- CUSTOM HOOKS ---
import useVisorState from './hooks/useVisorState';
import { getReverseGeocoding } from './utils/geoUtils';

// --- COMPONENTS ---
import InstitutionalHeader from './components/layout/InstitutionalHeader';
import SidebarDesktop from './components/layout/SidebarDesktop';
import MobileSearchBar from './components/search/MobileSearchBar';
import MapViewer from './components/map/MapViewer';
import Legend from './components/map/Legend';
import HelpModal from './components/modals/HelpModal';
import BottomSheetMobile from './components/layout/BottomSheetMobile';
import MapControls from './components/layout/MapControls';
import PdfExportController from './components/features/PdfExportController';
import OnboardingTour from './components/features/OnboardingTour';

// --- UI COMPONENTS ---
import Icons from './components/ui/Icons';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { ToastProvider, ToastContainer, useToast } from './components/ui/ToastSystem';



/* ------------------------------------------------ */
/* COMPONENT: VisorApp (Main) */
/* ------------------------------------------------ */
const VisorApp = () => {
    const { state, actions } = useVisorState();

    // Destructure State
    const {
        analyzing, extraDataLoaded, systemError, isHelpOpen, analysis, location,
        currentZoom, isLegendOpen, isSidebarOpen, activeBaseLayer, globalOpacity,
        approximateAddress, isExporting, exportProgress,
        visibleMapLayers, visibleZoningCats, loading, dataCache, constants, error
    } = state;

    // Destructure Actions
    const {
        updateState, handleLocationSelect: handleLocationSelectAction, handleReset: handleResetAction, toggleLayer, toggleZoningCat, addToast,
        setExportHandler, getExportHandler
    } = actions;

    // Refs
    const invalidateMapRef = useRef(null);
    const resetMapViewRef = useRef(null);
    const zoomInRef = useRef(null);
    const zoomOutRef = useRef(null);
    const desktopSearchInputRef = useRef(null);
    const mobileSearchInputRef = useRef(null);

    // --- HELPER CONSTANTS ---
    const MAPBOX_ACCESS_TOKEN = constants?.MAPBOX_TOKEN;

    // Wrapper for Location Select to inject Refs and Dependencies
    const onLocationSelect = (coord) => {
        handleLocationSelectAction(
            coord,
            mobileSearchInputRef,
            desktopSearchInputRef,
            getReverseGeocoding,
            MAPBOX_ACCESS_TOKEN
        );
    };

    const handleReset = () => {
        handleResetAction(resetMapViewRef);
    };

    // Wrapper for Export to use local state
    const handleExportClick = useCallback(async (e) => {
        const exportFn = getExportHandler();
        if (typeof exportFn === 'function') {
            if (isExporting) return; // Prevent double click

            updateState({ isExporting: true });

            try {
                await exportFn(e);
                addToast('Documento PDF generado exitosamente', 'success');
            } catch (err) {
                console.error("Export Error", err);
                addToast('Error al generar PDF', 'error');
            } finally {
                updateState({ isExporting: false, exportProgress: 0 });
            }
        } else {
            alert('Aún no se puede exportar. Intenta recargar la página.');
        }
    }, [getExportHandler, isExporting, addToast, updateState]);

    const handleUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
            p => {
                const coord = { lat: p.coords.latitude, lng: p.coords.longitude };
                onLocationSelect(coord);

                const text = `${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}`;
                if (desktopSearchInputRef.current) desktopSearchInputRef.current(text);
                if (mobileSearchInputRef.current) mobileSearchInputRef.current(text);
            },
            (e) => {
                console.warn(e);
                addToast("No se pudo obtener tu ubicación actual. Revisa permisos.", 'error');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const toggleZoningGroup = useCallback(() => {
        toggleLayer('zoning');
    }, [toggleLayer]);

    const setVisibleZoningCats = (val) => updateState({ visibleZoningCats: typeof val === 'function' ? val(visibleZoningCats) : val });
    const setActiveBaseLayer = (val) => updateState({ activeBaseLayer: val });
    const setMobileSheetState = (val) => updateState({ mobileSheetState: val });

    // Initialization Effect: Parse URL Params
    useEffect(() => {
        if (loading) return;

        // Simulate deprecated values for component compat
        if (!extraDataLoaded) updateState({ extraDataLoaded: true });

        if (error) {
            updateState({ systemError: `Error cargando datos: ${error}` });
            return;
        }

        const initUrlParams = async () => {
            const params = new URLSearchParams(window.location.search);
            const lat = parseFloat(params.get("lat"));
            const lng = parseFloat(params.get("lng"));
            const hasCoords = !isNaN(lat) && !isNaN(lng);

            if (hasCoords) onLocationSelect({ lat, lng });
        };

        initUrlParams();
    }, [loading, error, extraDataLoaded, updateState]); // Check deps carefully

    if (systemError) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border-l-4 border-red-600">
                    <Icons.AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Error de Inicialización</h1>
                    <p className="text-sm text-gray-600 mb-6">{systemError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                    >
                        Recargar Página
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-[#9d2148] flex-col gap-3">
                <Icons.Loader2 className="animate-spin h-10 w-10" />
                <span className="text-sm font-medium animate-pulse">Cargando visor...</span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col w-full h-full overflow-hidden ${loading || analyzing ? 'cursor-wait' : ''}`} style={{ background: 'var(--bg-soft-gradient)' }}>

            <InstitutionalHeader />

            <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">

                <div className="md:hidden absolute top-4 left-0 right-0 z-[2000] px-4 pointer-events-none flex justify-center">
                    <div className="w-full max-w-lg pointer-events-auto">
                        <MobileSearchBar
                            onLocationSelect={onLocationSelect}
                            onReset={handleReset}
                            setInputRef={mobileSearchInputRef}
                            initialValue={analysis ? `${analysis.coordinate.lat.toFixed(6)}, ${analysis.coordinate.lng.toFixed(6)}` : ''}
                        />
                    </div>
                </div>

                <SidebarDesktop
                    analysis={analysis}
                    approximateAddress={approximateAddress}
                    onLocationSelect={onLocationSelect}
                    onReset={handleReset}
                    isOpen={isSidebarOpen}
                    onToggle={() => updateState({ isSidebarOpen: !isSidebarOpen })}
                    onExportPDF={handleExportClick}
                    desktopSearchSetRef={desktopSearchInputRef}
                    isLoading={analyzing}
                    isExporting={isExporting}
                    exportProgress={exportProgress}
                    onOpenHelp={() => updateState({ isHelpOpen: true })}
                />

                <div className="relative flex-1 h-full w-full">
                    <MapViewer
                        location={location}
                        onLocationSelect={onLocationSelect}
                        analysisStatus={analysis?.status}
                        isANP={analysis?.isANP}
                        visibleMapLayers={visibleMapLayers}
                        setVisibleMapLayers={(newVal) => updateState({ visibleMapLayers: typeof newVal === 'function' ? newVal(visibleMapLayers) : newVal })}
                        visibleZoningCats={visibleZoningCats}
                        setVisibleZoningCats={(newVal) => updateState({ visibleZoningCats: typeof newVal === 'function' ? newVal(visibleZoningCats) : newVal })}
                        extraDataLoaded={extraDataLoaded}
                        activeBaseLayer={activeBaseLayer}
                        setActiveBaseLayer={(val) => updateState({ activeBaseLayer: val })}
                        globalOpacity={globalOpacity}
                        setGlobalOpacity={(val) => updateState({ globalOpacity: val })}

                        invalidateMapRef={invalidateMapRef}
                        resetMapViewRef={resetMapViewRef}
                        zoomInRef={zoomInRef}
                        zoomOutRef={zoomOutRef}
                        selectedAnpId={analysis?.anpId}
                        dataCache={dataCache}
                        onZoomChange={(z) => updateState({ currentZoom: z })}
                    />

                    <ToastContainer />

                    {loading && (
                        <div className="absolute inset-0 z-[2000] bg-white/60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-gray-200 border-l-[#9d2148] rounded-full animate-spin mb-3"></div>
                                <span className="text-gray-800 font-bold text-sm">Cargando mapa base...</span>
                            </div>
                        </div>
                    )}

                    <Legend
                        visibleMapLayers={visibleMapLayers}
                        toggleLayer={toggleLayer}
                        isOpen={isLegendOpen}
                        setIsOpen={(val) => updateState({ isLegendOpen: val })}
                        visibleZoningCats={visibleZoningCats}
                        toggleZoningGroup={toggleZoningGroup}
                        setVisibleZoningCats={setVisibleZoningCats}
                        activeBaseLayer={activeBaseLayer}
                        setActiveBaseLayer={setActiveBaseLayer}
                        selectedAnpId={analysis?.anpId}
                        anpName={analysis?.anpNombre}
                        anpGeneralVisible={visibleMapLayers.anp}
                    />



                    <MapControls
                        onOpenHelp={() => updateState({ isHelpOpen: true })}
                        isLegendOpen={isLegendOpen}
                        setLegendOpen={(val) => updateState({ isLegendOpen: val })}
                        globalOpacity={globalOpacity}
                        setGlobalOpacity={(val) => updateState({ globalOpacity: val })}
                        onResetView={() => resetMapViewRef.current?.()}
                        onUserLocation={handleUserLocation}
                        onZoomIn={() => zoomInRef.current?.()}
                        onZoomOut={() => zoomOutRef.current?.()}
                    />
                </div>

                <BottomSheetMobile
                    analysis={analysis}
                    onLocationSelect={onLocationSelect}
                    onReset={handleReset}
                    onStateChange={setMobileSheetState}
                    onClose={handleReset}
                    onExportPDF={handleExportClick}
                    isExporting={isExporting}
                    exportProgress={exportProgress}
                />

                <HelpModal
                    isOpen={isHelpOpen}
                    onClose={() => updateState({ isHelpOpen: false })}
                />

                <PdfExportController
                    analysis={analysis}
                    onExportReady={setExportHandler}
                    onProgress={(val) => updateState({ exportProgress: val })}
                    dataCache={dataCache}
                    visibleMapLayers={visibleMapLayers}
                    activeBaseLayer={activeBaseLayer}
                    visibleZoningCats={visibleZoningCats}
                    currentZoom={currentZoom}
                    approximateAddress={approximateAddress}
                />

                <OnboardingTour />
            </div>
        </div>
    );
};

const App = () => {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <VisorApp />
            </ToastProvider>
        </ErrorBoundary>
    );
};

export default App;

import { useState, useEffect, useRef, useCallback } from 'react';
import useAppData from './useAppData';
import { analyzeLocation } from '../utils/analysisEngine';
import { getReverseGeocoding } from '../utils/geoUtils';

const useVisorState = () => {
    // --- DATA HOOK INTEGRATION ---
    const hookResult = useAppData();
    const { loading, dataCache, constants, error } = hookResult;

    // --- LOCAL STATE ---
    const [state, setState] = useState({
        analyzing: false,
        extraDataLoaded: false,
        systemError: null,
        isHelpOpen: false,
        analysis: null,
        location: null,
        currentZoom: 12,
        isLegendOpen: false,
        isSidebarOpen: true,
        activeBaseLayer: 'SATELLITE',
        globalOpacity: 0.25,
        approximateAddress: null,
        mobileSheetState: 'collapsed',
        isExporting: false,
        exportProgress: 0,
        visibleMapLayers: {
            sc: true,
            anp: true,
            zoning: true,
            alcaldias: true,
            edomex: true,
            morelos: true,
            selectedAnpZoning: true
        },
        visibleZoningCats: {} // Populated on load
    });

    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);
    const exportHandlerRef = useRef(null);

    // --- ACTION HANDLERS ---

    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

    const addToast = useCallback((message, type = 'info') => {
        const id = toastIdRef.current++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    // --- MAP & ANALYSIS ACTIONS ---

    const handleLocationSelect = useCallback(async (c, searchInputRefMobile, searchInputRefDesktop, reverseGeocodeFn, MAPBOX_TOKEN) => {
        const lat = Number(c?.lat);
        const lng = Number(c?.lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return;

        const coord = { lat, lng };
        let displayText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        // Update UI immediately
        updateState({ location: coord, approximateAddress: null });

        if (searchInputRefDesktop?.current) searchInputRefDesktop.current(displayText);
        if (searchInputRefMobile?.current) searchInputRefMobile.current(displayText);

        // Reverse Geocoding
        // Use injected fn or imported fn
        const token = MAPBOX_TOKEN || constants?.MAPBOX_TOKEN;
        const geocode = reverseGeocodeFn || getReverseGeocoding;

        if (token && typeof geocode === 'function') {
            geocode(lat, lng, token).then(address => {
                if (address) {
                    updateState({ approximateAddress: address });
                }
            });
        }

        updateState({ analyzing: true });

        try {
            if (analyzeLocation) {
                // Ensure dataCache is fully loaded before analysis? 
                // Currently assume loaded if user can interact
                const res = await analyzeLocation(coord, dataCache);
                updateState({ analysis: res });

                if (res.status === 'OUTSIDE_CDMX') {
                    addToast('El punto seleccionado está fuera de la CDMX', 'info');
                } else {
                    addToast('¡Información encontrada!', 'success');
                }
            }
        } catch (err) {
            addToast('Hubo un inconveniente al consultar este punto.', 'error');
            console.error(err);
        } finally {
            updateState({ analyzing: false });
        }
    }, [dataCache, addToast, constants]);

    const handleReset = useCallback((resetMapViewRef) => {
        updateState({
            location: null,
            analysis: null,
            approximateAddress: null,
            mobileSheetState: 'collapsed'
        });
        if (resetMapViewRef?.current) {
            resetMapViewRef.current();
        }
    }, []);

    const toggleLayer = useCallback((key) => {
        updateState({
            visibleMapLayers: {
                ...state.visibleMapLayers,
                [key]: !state.visibleMapLayers[key]
            }
        });
    }, [state.visibleMapLayers]);

    const toggleZoningCat = useCallback((key) => {
        updateState({
            visibleZoningCats: {
                ...state.visibleZoningCats,
                [key]: !state.visibleZoningCats[key]
            }
        });
    }, [state.visibleZoningCats]);

    // --- EFFECTS ---

    // Initialize Zoning Cats
    useEffect(() => {
        if (constants?.ZONING_ORDER && Object.keys(state.visibleZoningCats).length === 0) {
            const d = {};
            constants.ZONING_ORDER.forEach(k => d[k] = true);
            updateState({ visibleZoningCats: d });
        }
    }, [constants, state.visibleZoningCats]);

    // --- PUBLIC API ---
    return {
        state: { ...state, loading, error, dataCache, constants, toasts },
        actions: {
            updateState,
            handleLocationSelect,
            handleReset,
            toggleLayer,
            toggleZoningCat,
            addToast,
            setExportHandler: (fn) => (exportHandlerRef.current = fn),
            getExportHandler: () => exportHandlerRef.current
        }
    };
};

export default useVisorState;

import { create } from 'zustand';

const useMapStore = create((set) => ({
    location: null,
    currentZoom: 12,
    activeBaseLayer: 'SATELLITE',
    globalOpacity: 0.25,
    visibleMapLayers: {
        sc: true,
        anp: true,
        zoning: true,
        alcaldias: true,
        edomex: true,
        morelos: true,
        selectedAnpZoning: true
    },

    // Refs (Mutable state that doesn't trigger re-renders, but we keep in store if needed, 
    // or keep in components. For now we only store serializable state here).

    // Actions
    setLocation: (location) => set({ location }),

    setZoom: (zoom) => set({ currentZoom: zoom }),

    setActiveBaseLayer: (layer) => set({ activeBaseLayer: layer }),

    setGlobalOpacity: (opacity) => set({ globalOpacity: opacity }),

    setVisibleMapLayers: (layers) => set((state) => ({
        visibleMapLayers: typeof layers === 'function' ? layers(state.visibleMapLayers) : layers
    })),

    toggleLayer: (key) => set((state) => ({
        visibleMapLayers: {
            ...state.visibleMapLayers,
            [key]: !state.visibleMapLayers[key]
        }
    })),

    resetMap: () => set({
        location: null,
        // We generally keep base layer and opacity preferences
    })
}));

export default useMapStore;

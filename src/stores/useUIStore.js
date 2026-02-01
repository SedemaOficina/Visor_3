import { create } from 'zustand';

const useUIStore = create((set) => ({
    isSidebarOpen: true,
    isLegendOpen: false,
    isHelpOpen: false,
    mobileSheetState: 'collapsed',
    toasts: [],
    toastIdRef: 0,

    // Actions
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    setLegendOpen: (isOpen) => set({ isLegendOpen: isOpen }),

    setHelpOpen: (isOpen) => set({ isHelpOpen: isOpen }),

    setMobileSheetState: (state) => set({ mobileSheetState: state }),

    addToast: (message, type = 'info') => set((state) => {
        const id = state.toastIdRef + 1;
        const newToast = { id, message, type };

        // Auto-remove after 5 seconds
        setTimeout(() => {
            set((currentState) => ({
                toasts: currentState.toasts.filter((t) => t.id !== id)
            }));
        }, 5000);

        return {
            toasts: [...state.toasts, newToast],
            toastIdRef: id
        };
    }),

    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
    })),

    // Reset UI state (optional helper)
    resetUI: () => set({
        isSidebarOpen: true,
        isLegendOpen: false,
        mobileSheetState: 'collapsed'
    })
}));

export default useUIStore;

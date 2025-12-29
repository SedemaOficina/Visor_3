(function () {

    // Ensure Safe Namespace
    window.App = window.App || {};
    window.App.Components = window.App.Components || {};
    const Icons = window.App.Components.Icons || {};

    const { useState, createContext, useContext, useCallback } = window.React;

    const ToastContext = createContext(null);

    const useToast = () => useContext(ToastContext);

    const ToastProvider = ({ children }) => {
        const [toasts, setToasts] = useState([]);

        const addToast = useCallback((message, type = 'info') => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => removeToast(id), 3000);
        }, []);

        const removeToast = useCallback((id) => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, []);

        return (
            <ToastContext.Provider value={{ addToast, toasts }}>
                {children}
            </ToastContext.Provider>
        );
    };

    const ToastContainer = () => {
        const { toasts } = useToast();
        return (
            <div className="absolute md:bottom-24 bottom-auto top-32 md:top-auto left-1/2 transform -translate-x-1/2 z-[5000] flex flex-col gap-2 pointer-events-none w-max max-w-[90%]">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`
                  pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-semibold text-white animate-slide-up flex items-center gap-2
                  ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-gray-800'}
                `}
                    >
                        {Icons.AlertCircle && t.type === 'error' && <Icons.AlertCircle className="h-4 w-4" />}
                        {Icons.CheckCircle && t.type === 'success' && <Icons.CheckCircle className="h-4 w-4" />}
                        {t.message}
                    </div>
                ))}
            </div>
        );
    };

    // Register to Global Namespace
    window.App.Components.ToastProvider = ToastProvider;
    window.App.Components.ToastContainer = ToastContainer;
    window.App.Components.useToast = useToast;

})();

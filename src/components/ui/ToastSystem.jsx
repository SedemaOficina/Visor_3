import useUIStore from '../../stores/useUIStore';
import { Icons } from './Icons';

// Compat hook if components use useToast()
export const useToast = () => {
    const addToast = useUIStore(state => state.addToast);
    return { addToast };
};

// Deprecated Provider (No-op wrapper to avoid breaking if left in tree temporarily)
export const ToastProvider = ({ children }) => <>{children}</>;

export const ToastContainer = () => {
    const toasts = useUIStore(state => state.toasts);

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

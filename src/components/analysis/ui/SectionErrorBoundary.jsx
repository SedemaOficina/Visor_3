import React from 'react';
import Icons from '../../ui/Icons'; // Assuming Icons are up one level from 'analysis/ui' -> 'ui' -> 'Icons' ? NO, Icons is in 'components/ui'.
// Correct path: src/components/analysis/ui/SectionErrorBoundary.jsx -> ../../ui/Icons (src/components/ui/Icons)

// Need to adjust imports based on where this file is placed
// Path: src/components/analysis/ui/SectionErrorBoundary.jsx
// Icons: src/components/ui/Icons.jsx -> ../../ui/Icons

class SectionErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Section Error Boundary Caught:", error, errorInfo);
        // Here we could log to an analytics service
    }

    handleRetry = () => {
        this.setState({ hasError: false });
        // Optional: trigger a parent reload/fetch if passed
        if (this.props.onRetry) {
            this.props.onRetry();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg flex flex-col items-center justify-center text-center my-4 animate-in fade-in">
                    <div className="text-red-400 mb-2">
                        {/* Fallback icon if Icons is undefined */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-red-900 mb-1">
                        No se pudo cargar esta sección
                    </h3>
                    <p className="text-xs text-red-700 mb-3 max-w-[200px]">
                        Ocurrió un error al procesar estos datos.
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-semibold rounded hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SectionErrorBoundary;

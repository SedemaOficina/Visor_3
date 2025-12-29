const Tooltip = ({ content, children, placement = 'top' }) => {
    const triggerRef = window.React.useRef(null);
    const { useEffect } = window.React;

    useEffect(() => {
        if (triggerRef.current && window.tippy && content) {
            const instance = window.tippy(triggerRef.current, {
                content: content,
                placement: placement,
                animation: 'scale',
                arrow: true,
                theme: 'light-border', // Ensure this theme CSS is loaded or default to a safe one if missing
                interactive: true, // Allow hovering over tooltip content if needed
                zIndex: 9999, // Force high z-index to resolve clipping issues
                appendTo: () => document.body, // Portal to body to avoid overflow:hidden clipping
            });

            return () => {
                instance.destroy();
            };
        }
    }, [content, placement]);

    // Render as a span wrapper to avoid breaking flex layouts, but ensure it captures events
    return (
        <span ref={triggerRef} className="inline-flex items-center cursor-help">
            {children}
        </span>
    );
};

// Register globally
window.App = window.App || {};
window.App.Components = window.App.Components || {};
window.App.Components.Tooltip = Tooltip;

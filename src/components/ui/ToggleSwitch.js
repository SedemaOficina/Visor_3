const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <div
        onClick={(e) => {
            e.stopPropagation();
            if (!disabled && onChange) onChange(!checked);
        }}
        className={`w-7 h-4 flex items-center rounded-full p-[2px] duration-300 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${checked && !disabled ? 'bg-[#9d2148]' : 'bg-gray-300'
            }`}
    >
        <div
            className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ${checked ? 'translate-x-3' : ''}`}
        />
    </div>
);

window.App.Components.ToggleSwitch = ToggleSwitch;

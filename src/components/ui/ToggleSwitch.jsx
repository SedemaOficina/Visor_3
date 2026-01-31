import React from 'react';

const ToggleSwitch = ({ checked, onChange, disabled, activeColor, title }) => (
    <div
        title={title}
        onClick={(e) => {
            e.stopPropagation();
            if (!disabled && onChange) onChange(!checked);
        }}
        className={`w-7 h-4 flex items-center rounded-full p-[2px] duration-300 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${checked && !disabled ? '' : 'bg-gray-300'
            }`}
        style={{
            backgroundColor: (checked && !disabled) ? (activeColor || '#9d2148') : undefined
        }}
    >
        <div
            className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ${checked ? 'translate-x-3' : ''}`}
        />
    </div>
);

export default ToggleSwitch;

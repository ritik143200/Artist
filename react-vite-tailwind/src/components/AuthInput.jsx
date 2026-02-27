import React, { useState } from 'react';

const AuthInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false,
  onTogglePassword,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputType = type === 'text' && showPasswordToggle ? 'text' : type;

  const handleChange = (e) => {
    const hasVal = e.target.value.length > 0;
    setHasValue(hasVal);
    onChange(e);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type={inputType}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 py-3 bg-white border-2 rounded-xl transition-all duration-300
          ${isFocused ? 'border-brand-500 shadow-lg shadow-brand-500/20' : 'border-gray-200'}
          ${error ? 'border-red-500' : ''}
          ${hasValue ? 'text-gray-900' : 'text-gray-500'}
          placeholder:text-gray-400
          focus:outline-none
          peer
        `}
        {...props}
      />

      <label className={`
        absolute left-4 transition-all duration-300 pointer-events-none bg-white px-1
        ${hasValue || isFocused ? '-top-3 text-sm text-brand-500' : 'top-3.5 text-gray-500'}
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-brand-500
      `}>
        {label}
      </label>

      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600 transition-colors"
        >
          {type === 'text' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.629l5.844 5.844zM12 15.75a3.75 3.75 0 013.75-3.75 3.75 3.75 0 00-3.75 3.75z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C1.934 14.026 2.736 15.9 3.98 17.122l5.842 5.842a1.5 1.5 0 002.121 0l5.842-5.842zm12.378 0a1.5 1.5 0 002.121 0l5.842-5.842A10.477 10.477 0 0022.066 12c0-4.477-2.743-8.268-6.5-9.543l-5.842 5.842a1.5 1.5 0 010 2.121z" />
            </svg>
          )}
        </button>
      )}

      {error && (
        <p className="absolute -bottom-6 left-4 text-sm text-red-500 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;

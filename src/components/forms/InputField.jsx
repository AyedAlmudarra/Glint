import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = ({ name, type, placeholder, value, onChange, onBlur, icon, error, touched, isPassword, showPassword, onToggleShowPassword }) => (
  <div>
    <div className="relative">
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full bg-gray-700/50 border rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 text-right ${error && touched ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}`}
      />
      {isPassword && (
        <button type="button" onClick={onToggleShowPassword} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
    {touched && error && <p className="text-red-400 text-xs text-right mt-1">{error}</p>}
  </div>
);

export default InputField; 
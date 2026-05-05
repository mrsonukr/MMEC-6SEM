import { forwardRef } from "react";

const colorMap = {
    black: {
        line: "bg-black",
        label: "peer-focus:text-black",
    },
    blue: {
        line: "bg-blue-600",
        label: "peer-focus:text-blue-600",
    },
    sky: {
        line: "bg-sky-500",
        label: "peer-focus:text-sky-500",
    },
};

const FloatingInput = forwardRef(function FloatingInput({
    label = "Email",
    type = "text",
    value,
    onChange,
    onKeyDown,
    id,
    autoFocus = false,
    color = "black",
    capitalize = false,
    uppercase = false,
    lowercase = false,
    showError = false,
}, ref) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const { line, label: labelColor } = colorMap[color] || colorMap.black;
    const lineBg = showError ? "bg-red-500" : line;
    const textTransform = uppercase ? "uppercase" : capitalize ? "capitalize" : lowercase ? "lowercase" : "";

    return (
        <div className="relative w-full">

            {/* Input */}
            <input
                ref={ref}
                id={inputId}
                type={type}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder=" "
                autoFocus={autoFocus}
                className={`
          peer
          w-full
          border-b
          font-medium
          border-gray-300
          bg-transparent
          py-3
          text-gray-800
          focus:outline-none
          ${textTransform}
        `}
            />

            {/* Animated line */}
            <span
                className={`
          absolute
          bottom-0
          left-0
          w-full
          h-[2px]
          ${lineBg}
          transform
          scale-x-0
          origin-center
          transition-transform
          duration-300
          peer-focus:scale-x-100
        `}
            ></span>

            {/* Floating label */}
            <label
                htmlFor={inputId}
                className={`
          absolute
          left-0
          -top-3
          text-xs
          text-gray-500
          transition-all
          cursor-text
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400
          peer-focus:-top-3
          peer-focus:text-xs
          ${labelColor}
        `}
            >
                {label}
            </label>

        </div>
    );
});

export default FloatingInput;
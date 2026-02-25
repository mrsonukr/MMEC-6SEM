const variants = {
    primary: "bg-black text-white hover:bg-gray-900",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-500 hover:text-black",
};

const sizes = {
    sm: "py-1.5 px-4 text-sm",
    md: "py-2.5 px-6 text-sm",
    lg: "py-3 px-8 text-base",
};

export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    icon,
    iconPosition = "right",
    disabled = false,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center justify-center gap-2 rounded-lg font-medium transition
                ${variants[variant] || variants.primary}
                ${sizes[size] || sizes.md}
                ${fullWidth ? "w-full" : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${className}
            `}
        >
            {icon && iconPosition === "left" && <span>{icon}</span>}
            {children}
            {icon && iconPosition === "right" && <span>{icon}</span>}
        </button>
    );
}

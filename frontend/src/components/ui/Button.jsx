export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, icon }) {
    const baseClasses = "inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        secondary: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
    };
    const disabledClasses = "opacity-50 cursor-not-allowed";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''}`}
        >
            {icon && <span className="mr-2 -ml-1">{icon}</span>}
            {children}
        </button>
    );
}
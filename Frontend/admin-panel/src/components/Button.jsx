// src/components/Button.jsx
 export function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-1 border border-secondary text-secondary 
                  hover:bg-secondary hover:text-white transition rounded-sm ${className}`}
    >
      {children}
    </button>
  );
}
 export function Button1({ children, onClick, type = "button",  }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-4 py-2 mt-2 bg-secondary text-primary rounded-lg hover:bg-buttonHover hover:text-text1 transition"
    >
      {children}
    </button>
  );
}

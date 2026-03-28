import { useRef, useEffect } from 'react';

export default function DropdownMenu({ isOpen, onClose, items }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]); // ✅ FIXED dependency

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()} // ✅ prevent parent close
      className="absolute top-14 right-4 bg-white rounded-2xl shadow-xl border border-gray-200 w-56 z-[999] overflow-hidden"
    >
      <div className="p-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick?.();
              onClose(); // ✅ auto close
            }}
            className={`flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-gray-100 transition ${
              item.danger ? 'text-red-500 font-medium' : ''
            }`}
          >
            <span className="text-sm font-medium">{item.label}</span>
            <span>{item.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
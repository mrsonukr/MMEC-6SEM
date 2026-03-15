import { forwardRef } from 'react'

const FloatingInput = forwardRef(function FloatingInput({
  label='Email', type='text', value, onChange, id, autoFocus=false,
  capitalize=false, uppercase=false, lowercase=false, showError=false, disabled=false,
}, ref) {
  const inputId = id || label.toLowerCase().replace(/\s+/g,'-')
  const transform = uppercase ? 'uppercase' : capitalize ? 'capitalize' : lowercase ? 'lowercase' : ''
  return (
    <div className="relative w-full group">
      <input
        ref={ref} id={inputId} type={type} value={value} onChange={onChange}
        placeholder=" " autoFocus={autoFocus} disabled={disabled}
        className={`peer w-full bg-transparent border-b-2 py-3 pr-2 font-medium text-[#F9FAFB] text-base
          focus:outline-none transition-all duration-300 disabled:opacity-40 ${transform}
          ${showError ? 'border-red-500' : 'border-[#111]/[0.15] focus:border-violet-500'}`}
      />
      <span className={`absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 peer-focus:scale-x-100
        ${showError ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-cyan-400'}`}
        style={{ boxShadow: showError ? 'none' : '0 0 8px rgba(124,58,237,0.6)' }}
      />
      <label htmlFor={inputId}
        className={`absolute left-0 cursor-text transition-all duration-300 font-medium tracking-wide
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#4B5563]
          peer-focus:-top-4 peer-focus:text-xs -top-4 text-xs
          ${showError ? 'text-red-400 peer-focus:text-red-400' : 'text-violet-400 peer-focus:text-violet-400'}`}>
        {label}
      </label>
    </div>
  )
})
export default FloatingInput

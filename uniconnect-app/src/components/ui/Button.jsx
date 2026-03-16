export default function Button({ children, onClick, type='button', variant='primary', size='md', fullWidth=false, icon, iconPosition='right', disabled=false, className='' }) {
  const base = `inline-flex items-center justify-center gap-2 font-medium transition-all duration-250 focus:outline-none select-none`
  const variants = {
    primary: 'btn-gold',
    outline: 'btn-outline',
    ghost:   'text-[#6B7280] hover:text-[#D1D5DB] bg-transparent border-0',
  }
  const sizes = { sm: 'py-2 px-5 text-sm', md: 'py-2.5 px-7 text-sm', lg: 'py-3.5 px-10 text-base' }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]||variants.primary} ${sizes[size]||sizes.md}
        ${fullWidth?'w-full':''} ${disabled?'opacity-40 cursor-not-allowed pointer-events-none':''} ${className}`}>
      {icon && iconPosition==='left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition==='right' && <span>{icon}</span>}
    </button>
  )
}

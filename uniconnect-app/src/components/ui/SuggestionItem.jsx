import { useState } from 'react'
import { UserPlus, Check } from 'lucide-react'

export default function SuggestionItem({ name, image }) {
  const [connected, setConnected] = useState(false)
  return (
    <div className="flex items-center justify-between py-3 group">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <img src={image} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-800/40 ring-offset-1 ring-offset-[#111] transition-transform duration-200 group-hover:scale-105" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F9FAFB] group-hover:text-violet-400 transition-colors duration-150">{name}</p>
          <p className="text-xs text-[#6B7280]">Student · UniConnect</p>
        </div>
      </div>
      <button onClick={() => setConnected(c=>!c)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 active:scale-95
          ${connected ? 'bg-violet-950/60 text-violet-400 border border-violet-700/40' : 'btn-outline text-xs py-1.5 px-3'}`}>
        {connected ? <><Check size={11} />Connected</> : <><UserPlus size={11} />Connect</>}
      </button>
    </div>
  )
}

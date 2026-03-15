import SuggestionItem from './ui/SuggestionItem'
import { Users } from 'lucide-react'

const users = ['Desiree Baptista','James Dorwart','Jocelyn Westervelt','Phillip Aminoff','Ann Levin']

export default function SuggestionCard() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Users size={15} className="text-violet-400" />
        <h3 className="font-semibold text-sm text-[#F9FAFB]">People You May Know</h3>
      </div>
      <p className="text-xs text-[#6B7280] mb-3">Based on your profile</p>
      <div className="divide-y divide-white/[0.06]">
        {users.map((name,i) => (
          <div key={i} className="animate-fade-up" style={{animationDelay:`${i*60}ms`}}>
            <SuggestionItem name={name} image={`https://randomuser.me/api/portraits/${i%2?'men':'women'}/${i+20}.jpg`} />
          </div>
        ))}
      </div>
      <button className="w-full text-center text-xs text-violet-400 hover:text-violet-300 font-medium mt-3 py-1.5 hover:bg-violet-950/40 rounded-lg transition-all duration-150">View More →</button>
    </div>
  )
}

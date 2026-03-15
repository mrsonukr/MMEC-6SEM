import { useState, useEffect } from 'react'
import { Users, RefreshCw, Plus, Pencil, Trash2, Sparkles, X } from 'lucide-react'

const API = 'https://backend.uniconnectmmu.workers.dev/users'
const EMPTY_FORM = { user_id: '', full_name: '', role: 'student', email: '' }

export default function Home() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess('') }
    else { setSuccess(msg); setError('') }
    setTimeout(() => { setError(''); setSuccess('') }, 3500)
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(API)
      const data = await res.json()
      setUsers(data.results || [])
    } catch { flash('Failed to fetch users', true) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setFormError('')
    if (!form.user_id || !form.full_name || !form.email) { setFormError('All fields are required.'); return }
    setSubmitting(true)
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok && data.success) { flash('User created!'); setForm(EMPTY_FORM); fetchUsers() }
      else setFormError(data.message || 'Failed.')
    } catch { setFormError('Network error.') }
    finally { setSubmitting(false) }
  }

  const openEdit = (user) => {
    setEditModal(user)
    setEditForm({ user_id: user.user_id, full_name: user.full_name, role: user.role, email: user.email })
    setEditError('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault(); setEditError(''); setEditSubmitting(true)
    try {
      const res = await fetch(`${API}/${editModal.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) })
      const data = await res.json()
      if (res.ok && data.success) { flash('User updated!'); setEditModal(null); fetchUsers() }
      else setEditError(data.message || 'Failed.')
    } catch { setEditError('Network error.') }
    finally { setEditSubmitting(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`${API}/${deleteConfirm.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) { flash('User deleted.'); setDeleteConfirm(null); fetchUsers() }
      else { flash(data.message || 'Failed.', true); setDeleteConfirm(null) }
    } catch { flash('Network error.', true); setDeleteConfirm(null) }
    finally { setDeleting(false) }
  }

  const InputField = ({ label, ...props }) => (
    <div>
      <label className="block text-xs font-medium text-[#6B7280] mb-1.5 tracking-wide uppercase">{label}</label>
      <input
        className="w-full bg-[#0A0A0A] border border-[#111]/[0.12] rounded-xl px-4 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-800/50 transition-all"
        {...props}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-10 px-4 page-enter">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center animate-fade-up">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={20} className="text-violet-400" />
            <h1 className="font-display text-4xl font-semibold text-[#F9FAFB]">UniConnect</h1>
          </div>
          <p className="text-sm text-[#6B7280] tracking-wide">User Management Dashboard</p>
        </div>

        {/* Toasts */}
        {success && (
          <div className="bg-violet-950/40 border border-[color:var(--accent-light)] text-violet-400 px-5 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] flex-shrink-0" />
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Create User */}
        <div className="card p-6 animate-fade-up stagger-1">
          <div className="flex items-center gap-2 mb-5">
            <Plus size={16} className="text-violet-400" />
            <h2 className="font-display text-lg font-semibold text-[#F9FAFB]">Add New User</h2>
          </div>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-xs mb-4">{formError}</div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="User ID" type="text" value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} placeholder="e.g. 11232763" />
            <InputField label="Full Name" type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Sonu Kumar" />
            <InputField label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. sonu@example.com" />
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5 tracking-wide uppercase">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#111]/[0.12] rounded-xl px-4 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" disabled={submitting}
                className="btn-gold px-8 py-2.5 rounded-full text-sm disabled:opacity-50"
              >
                {submitting ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="card p-6 animate-fade-up stagger-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-violet-400" />
              <h2 className="font-display text-lg font-semibold text-[#F9FAFB]">All Users</h2>
              <span className="text-xs bg-violet-950/40 text-violet-400 border border-[#111]/[0.07] px-2.5 py-0.5 rounded-full font-medium">
                {users.length}
              </span>
            </div>
            <button onClick={fetchUsers}
              className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-violet-400 transition-colors"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-14 gap-2 text-[#6B7280]">
              <div className="w-4 h-4 rounded-full border-2 border-[color:var(--accent-light)] border-t-[color:var(--accent)] animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-14 text-sm text-[#6B7280]">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#111]/[0.07] text-[#6B7280] text-[10px] uppercase tracking-widest">
                    {['ID','User ID','Full Name','Email','Role','Created At','Actions'].map(h => (
                      <th key={h} className="pb-3 pr-5 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} className="border-b border-[#111]/[0.07] hover:bg-violet-950/40 transition-colors animate-fade-in"
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      <td className="py-3.5 pr-5 text-[#6B7280] text-xs">{user.id}</td>
                      <td className="py-3.5 pr-5 font-mono text-xs text-[#D1D5DB]">{user.user_id}</td>
                      <td className="py-3.5 pr-5 font-medium text-[#F9FAFB]">{user.full_name}</td>
                      <td className="py-3.5 pr-5 text-[#6B7280]">{user.email}</td>
                      <td className="py-3.5 pr-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase
                          ${user.role === 'teacher'
                            ? 'bg-violet-950/40 text-violet-400 border border-[#111]/[0.07]'
                            : 'bg-[#0A0A0A] text-[#D1D5DB] border border-[#111]/[0.07]'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 pr-5 text-[#6B7280] text-xs">{user.created_at}</td>
                      <td className="py-3.5 flex gap-2">
                        <button onClick={() => openEdit(user)}
                          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-violet-950/40 hover:text-violet-400 transition-all"
                        >
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteConfirm(user)}
                          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="card w-full max-w-md p-7 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-semibold text-[#F9FAFB]">Edit User</h3>
              <button onClick={() => setEditModal(null)} className="text-[#6B7280] hover:text-[#F9FAFB] transition-colors">
                <X size={18} />
              </button>
            </div>
            {editError && <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-xs mb-4">{editError}</div>}
            <form onSubmit={handleUpdate} className="space-y-4">
              {[
                { label: 'User ID', field: 'user_id', type: 'text' },
                { label: 'Full Name', field: 'full_name', type: 'text' },
                { label: 'Email', field: 'email', type: 'email' },
              ].map(({ label, field, type }) => (
                <InputField key={field} label={label} type={type}
                  value={editForm[field]}
                  onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                />
              ))}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1.5 tracking-wide uppercase">Role</label>
                <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#111]/[0.12] rounded-xl px-4 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:border-violet-500 transition-all"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditModal(null)} className="btn-outline px-5 py-2 rounded-full text-sm">Cancel</button>
                <button type="submit" disabled={editSubmitting} className="btn-gold px-6 py-2 rounded-full text-sm disabled:opacity-50">
                  {editSubmitting ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="card w-full max-w-sm p-7 text-center animate-fade-up">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#F9FAFB] mb-2">Delete User?</h3>
            <p className="text-sm text-[#6B7280] mb-7">
              Are you sure you want to remove <span className="font-medium text-[#F9FAFB]">{deleteConfirm.full_name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline px-5 py-2 rounded-full text-sm">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

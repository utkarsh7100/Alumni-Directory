import React, { useState } from 'react'

export default function RegistrationForm({ onAdded, apiBase }) {
  const [form, setForm] = useState({ name:'', batch_year:'', company:'', linkedin_url:'' })
  const [msg, setMsg] = useState('')

  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function submit(e) {
    e.preventDefault()
    if (!form.name || !form.batch_year) { setMsg('Required'); return }
    const res = await fetch(`${apiBase}/alumni`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    const j = await res.json()
    if (j.success) {
      setForm({ name:'', batch_year:'', company:'', linkedin_url:'' })
      setMsg('Saved')
      onAdded()
    } else setMsg('Error')
    setTimeout(()=>setMsg(''),2000)
  }

  return (
    <form onSubmit={submit} className="form-box">
      <h2>Register</h2>
      <div className="grid-2">
        <input className="input" name="name" placeholder="Name" value={form.name} onChange={update} />
        <input className="input" name="batch_year" placeholder="Batch Year" value={form.batch_year} onChange={update} />
        <input className="input" name="company" placeholder="Company" value={form.company} onChange={update} />
        <input className="input" name="linkedin_url" placeholder="LinkedIn URL" value={form.linkedin_url} onChange={update} />
      </div>
      <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:10 }}>
        <button className="btn btn-primary" type="submit">Add</button>
        <span className="small">{msg}</span>
      </div>
    </form>
  )
}


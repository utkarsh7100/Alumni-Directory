import React, { useEffect, useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import DirectoryFeed from './components/DirectoryFeed'
import BatchFilter from './components/BatchFilter'
import './index.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function App() {
  const [profiles, setProfiles] = useState([])
  const [batch, setBatch] = useState('')

  async function fetchProfiles(batchYear) {
    const q = batchYear ? `?batch=${batchYear}` : ''
    const res = await fetch(`${API_BASE}/alumni${q}`)
    const j = await res.json()
    setProfiles(j.data || [])
  }

  useEffect(() => { fetchProfiles(batch) }, [batch])

  return (
    <div className="container">
      <h1>Alumni Directory</h1>
      <RegistrationForm onAdded={() => fetchProfiles(batch)} apiBase={API_BASE} />
      <BatchFilter onChange={b => setBatch(b)} />
      <DirectoryFeed profiles={profiles} />
    </div>
  )
}


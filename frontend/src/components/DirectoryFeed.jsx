import React from 'react'
import ProfileCard from './ProfileCard'

export default function DirectoryFeed({ profiles }) {
  if (!profiles || profiles.length === 0) return <div className="small">No profiles yet.</div>
  return (
    <div className="card-grid">
      {profiles.map(p => <ProfileCard key={p.id} {...p} />)}
    </div>
  )
}


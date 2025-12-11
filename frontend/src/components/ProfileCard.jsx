import React from 'react'

export default function ProfileCard({ name, batch_year, company, linkedin_url }) {
  return (
    <div className="card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h3>{name}</h3>
        <div className="badge">{batch_year}</div>
      </div>
      <div className="meta">{company || '—'}</div>
      {linkedin_url ? (
        <a className="link" href={linkedin_url} target="_blank" rel="noopener noreferrer">Open LinkedIn</a>
      ) : (
        <span className="link secondary">No link</span>
      )}
    </div>
  )
}


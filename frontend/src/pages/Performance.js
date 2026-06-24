import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Performance() {
  const { id } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => { api.get(`/performance/${id}`).then(r => setRecords(r.data)); }, [id]);

  const tagColor = t => ({ Exceeding: '#28a745', 'On Track': '#17a2b8', Lagging: '#f0ad4e', Critical: '#dc3545' }[t] || '#ccc');

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <a href="/projects" style={{ color: '#1a73e8' }}>← Retour aux projets</a>
      <h2 style={{ color: '#1a73e8' }}>📊 Performance Tracker — Projet #{id}</h2>
      <p style={{ color: '#666', fontSize: 13 }}>Formule : (Tâches complétées / Total) × 40 + (Heures restantes / Allouées) × 40 − (Breaches × 10) | Max: 80</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginTop: 20 }}>
        {records.map(r => (
          <div key={r.id} style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `5px solid ${tagColor(r.status_tag)}` }}>
            <h3 style={{ margin: '0 0 10px' }}>👤 {r.member_name}</h3>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: tagColor(r.status_tag) }}>{parseFloat(r.score).toFixed(1)}<span style={{ fontSize: 16 }}>/80</span></div>
            <span style={{ background: tagColor(r.status_tag), color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: 13 }}>{r.status_tag}</span>
            <p style={{ fontSize: 12, color: '#666', marginTop: 10 }}>Mis à jour : {new Date(r.computed_at).toLocaleString()}</p>
          </div>
        ))}
        {records.length === 0 && <p style={{ color: '#666' }}>Aucune donnée — loggez des heures d'abord.</p>}
      </div>
    </div>
  );
}
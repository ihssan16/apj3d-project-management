import { useState, useEffect } from 'react';
import api from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', client: '', type: '', priority: 'Medium', start_date: '', end_date: '', total_hours: '', budget: '', scope: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { api.get('/projects').then(r => setProjects(r.data)); }, []);

  const handleCreate = async () => {
    await api.post('/projects', form);
    const res = await api.get('/projects');
    setProjects(res.data);
    setShowForm(false);
    setForm({ name: '', client: '', type: '', priority: 'Medium', start_date: '', end_date: '', total_hours: '', budget: '', scope: '' });
  };

  const statusColor = s => ({ Draft: '#6c757d', 'Pending Estimation': '#f0ad4e', Active: '#28a745', 'In Review': '#17a2b8', Delivered: '#007bff', Closed: '#dc3545' }[s] || '#ccc');

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#1a73e8' }}>📁 Projets</h2>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Nouveau Projet
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20, border: '1px solid #dee2e6' }}>
          <h3>Nouveau Projet</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['name','Nom du projet'],['client','Client'],['type','Type'],['total_hours','Heures totales'],['budget','Budget'],['start_date','Date début'],['end_date','Date fin']].map(([field, label]) => (
              <input key={field} placeholder={label} type={field.includes('date') ? 'date' : 'text'}
                value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            ))}
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}>
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>
          </div>
          <textarea placeholder="Scope du projet" value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })}
            style={{ width: '100%', marginTop: 10, padding: 8, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <button onClick={handleCreate}
            style={{ marginTop: 10, padding: '10px 30px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Créer
          </button>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <thead style={{ background: '#1a73e8', color: '#fff' }}>
          <tr>{['Code', 'Nom', 'Client', 'Priorité', 'Heures', 'Statut', 'Actions'].map(h => (
            <th key={h} style={{ padding: 12, textAlign: 'left' }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={p.id} style={{ background: i % 2 === 0 ? '#f8f9fa' : '#fff' }}>
              <td style={{ padding: 12 }}>{p.project_code}</td>
              <td style={{ padding: 12 }}><strong>{p.name}</strong></td>
              <td style={{ padding: 12 }}>{p.client}</td>
              <td style={{ padding: 12 }}>{p.priority}</td>
              <td style={{ padding: 12 }}>{p.total_hours}h</td>
              <td style={{ padding: 12 }}>
                <span style={{ background: statusColor(p.status), color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 12 }}>{p.status}</span>
              </td>
              <td style={{ padding: 12 }}>
                <a href={`/projects/${p.id}/estimation`} style={{ marginRight: 8, color: '#1a73e8' }}>Estimation</a>
                <a href={`/projects/${p.id}/assignments`} style={{ marginRight: 8, color: '#28a745' }}>Équipe</a>
                <a href={`/projects/${p.id}/tasks`} style={{ marginRight: 8, color: '#f0ad4e' }}>Tâches</a>
                <a href={`/projects/${p.id}/tracking`} style={{ marginRight: 8, color: '#6f42c1' }}>Heures</a>
                <a href={`/projects/${p.id}/performance`} style={{ marginRight: 8, color: '#dc3545' }}>Perf</a>
                <a href={`/projects/${p.id}/reports`} style={{ color: '#17a2b8' }}>Rapports</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
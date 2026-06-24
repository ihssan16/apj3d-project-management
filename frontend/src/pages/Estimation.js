import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Estimation() {
  const { id } = useParams();
  const [estimation, setEstimation] = useState(null);
  const [form, setForm] = useState({ est_hours: '', hourly_rate: '' });

  useEffect(() => { api.get(`/estimations/${id}`).then(r => setEstimation(r.data)).catch(() => {}); }, [id]);

  const handleCreate = async () => {
    const res = await api.post('/estimations', { project_id: id, ...form });
    setEstimation(res.data);
  };

  const handleApprove = async (status) => {
    const res = await api.patch(`/estimations/${estimation.id}/approve`, { approval_status: status });
    setEstimation(res.data);
  };

  const statusColor = s => ({ Draft: '#6c757d', 'Under Review': '#f0ad4e', Approved: '#28a745', Rejected: '#dc3545' }[s] || '#ccc');

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <a href="/projects" style={{ color: '#1a73e8' }}>← Retour aux projets</a>
      <h2 style={{ color: '#1a73e8' }}>💰 Estimation — Projet #{id}</h2>

      {!estimation ? (
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, maxWidth: 400 }}>
          <h3>Créer une estimation</h3>
          <input placeholder="Heures estimées" type="number" value={form.est_hours}
            onChange={e => setForm({ ...form, est_hours: e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <input placeholder="Taux horaire (€)" type="number" value={form.hourly_rate}
            onChange={e => setForm({ ...form, hourly_rate: e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }} />
          {form.est_hours && form.hourly_rate && (
            <p><strong>Prix calculé : {form.est_hours * form.hourly_rate} €</strong></p>
          )}
          <button onClick={handleCreate}
            style={{ padding: '10px 30px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Créer
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 500 }}>
          <p><strong>Heures estimées :</strong> {estimation.est_hours}h</p>
          <p><strong>Taux horaire :</strong> {estimation.hourly_rate} €</p>
          <p><strong>Prix total :</strong> {estimation.quoted_price} €</p>
          <p><strong>Statut :</strong> <span style={{ background: statusColor(estimation.approval_status), color: '#fff', padding: '3px 10px', borderRadius: 12 }}>{estimation.approval_status}</span></p>
          <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
            <button onClick={() => handleApprove('Under Review')} style={{ padding: '8px 16px', background: '#f0ad4e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Under Review</button>
            <button onClick={() => handleApprove('Approved')} style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Approuver ✅</button>
            <button onClick={() => handleApprove('Rejected')} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Rejeter ❌</button>
          </div>
        </div>
      )}
    </div>
  );
}
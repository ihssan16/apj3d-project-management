import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function TimeTracking() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ task_id: '', member_id: '', date: '', hours_logged: '', notes: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get(`/tasks/${id}`).then(r => setTasks(r.data));
    api.get(`/assignments/${id}`).then(r => setAssignments(r.data));
  }, [id]);

  const handleLog = async () => {
    await api.post('/timelogs', form);
    setMsg('✅ Heures enregistrées !');
    const res = await api.get(`/assignments/${id}`);
    setAssignments(res.data);
    setForm({ task_id: '', member_id: '', date: '', hours_logged: '', notes: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  const getColor = (used, allocated) => {
    const pct = (used / allocated) * 100;
    return pct >= 100 ? '#dc3545' : pct >= 75 ? '#f0ad4e' : '#28a745';
  };

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <a href="/projects" style={{ color: '#1a73e8' }}>← Retour aux projets</a>
      <h2 style={{ color: '#1a73e8' }}>⏱ Suivi des Heures — Projet #{id}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 25 }}>
        {assignments.map(a => {
          const pct = Math.min(100, (a.hours_used / a.allocated_hours) * 100);
          const color = getColor(a.hours_used, a.allocated_hours);
          return (
            <div key={a.id} style={{ background: '#fff', padding: 15, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderTop: `4px solid ${color}` }}>
              <strong>{a.name}</strong>
              <p style={{ margin: '5px 0', fontSize: 13 }}>{a.hours_used}h / {a.allocated_hours}h</p>
              <div style={{ background: '#eee', borderRadius: 10, height: 8 }}>
                <div style={{ width: `${pct}%`, background: color, borderRadius: 10, height: 8 }} />
              </div>
              <p style={{ fontSize: 12, color, marginTop: 5 }}>
                {pct >= 100 ? '🔴 DÉPASSÉ' : pct >= 75 ? '🟡 À risque' : '🟢 On track'}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
        <h3>Logger des heures</h3>
        {msg && <p style={{ color: '#28a745' }}>{msg}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <select value={form.task_id} onChange={e => setForm({ ...form, task_id: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}>
            <option value="">Choisir une tâche</option>
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          <select value={form.member_id} onChange={e => setForm({ ...form, member_id: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}>
            <option value="">Choisir membre</option>
            {assignments.map(a => <option key={a.member_id} value={a.member_id}>{a.name}</option>)}
          </select>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
          <input placeholder="Heures travaillées" type="number" value={form.hours_logged} onChange={e => setForm({ ...form, hours_logged: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd', gridColumn: 'span 2' }} />
        </div>
        <button onClick={handleLog} style={{ marginTop: 10, padding: '10px 30px', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Logger les heures
        </button>
      </div>
    </div>
  );
}
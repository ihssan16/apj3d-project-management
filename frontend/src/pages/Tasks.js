import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Tasks() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ assigned_to: '', title: '', est_hours: '', deadline: '', priority: 'Medium', parent_task_id: '' });

  useEffect(() => {
    api.get(`/tasks/${id}`).then(r => setTasks(r.data));
    api.get('/members').then(r => setMembers(r.data));
  }, [id]);

  const handleCreate = async () => {
    await api.post('/tasks', { project_id: id, ...form });
    const res = await api.get(`/tasks/${id}`);
    setTasks(res.data);
    setForm({ assigned_to: '', title: '', est_hours: '', deadline: '', priority: 'Medium', parent_task_id: '' });
  };

  const handleStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    const res = await api.get(`/tasks/${id}`);
    setTasks(res.data);
  };

  const statusColor = s => ({ 'Not Started': '#6c757d', 'In Progress': '#1a73e8', Review: '#f0ad4e', Completed: '#28a745', Blocked: '#dc3545' }[s] || '#ccc');

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <a href="/projects" style={{ color: '#1a73e8' }}>← Retour aux projets</a>
      <h2 style={{ color: '#1a73e8' }}>✅ Tâches — Projet #{id}</h2>

      <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h3>Nouvelle Tâche</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input placeholder="Titre de la tâche" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
          <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}>
            <option value="">Assigner à...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input placeholder="Heures estimées" type="number" value={form.est_hours} onChange={e => setForm({ ...form, est_hours: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
          <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}>
            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
          </select>
          <select value={form.parent_task_id} onChange={e => setForm({ ...form, parent_task_id: e.target.value })} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}>
            <option value="">Tâche parente (optionnel)</option>
            {tasks.filter(t => !t.parent_task_id).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <button onClick={handleCreate} style={{ marginTop: 10, padding: '10px 30px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Créer Tâche
        </button>
      </div>

      {tasks.map(t => (
        <div key={t.id} style={{ background: t.parent_task_id ? '#f0f4ff' : '#fff', padding: 15, borderRadius: 8, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginLeft: t.parent_task_id ? 30 : 0, borderLeft: t.parent_task_id ? '3px solid #1a73e8' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{t.parent_task_id ? '↳ ' : ''}{t.title}</strong>
              <span style={{ marginLeft: 10, fontSize: 12, color: '#666' }}>👤 {t.member_name} | ⏱ {t.est_hours}h est. / {t.logged_hours}h log. | 📅 {t.deadline?.split('T')[0]}</span>
            </div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ background: statusColor(t.status), color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 12 }}>{t.status}</span>
              <select value={t.status} onChange={e => handleStatus(t.id, e.target.value)} style={{ padding: 4, borderRadius: 4, border: '1px solid #ddd', fontSize: 12 }}>
                {['Not Started', 'In Progress', 'Review', 'Completed', 'Blocked'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
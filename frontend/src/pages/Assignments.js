import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Assignments() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState([{ member_id: '', allocated_hours: '', role: '', start_date: '' }]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => setProject(r.data));
    api.get('/members').then(r => setMembers(r.data));
    api.get(`/assignments/${id}`).then(r => setSaved(r.data)).catch(() => {});
  }, [id]);

  const totalAllocated = assignments.reduce((s, a) => s + parseFloat(a.allocated_hours || 0), 0);
  const projectTotal = parseFloat(project?.total_hours || 0);
  const isValid = projectTotal > 0 && Math.abs(totalAllocated - projectTotal) < 0.01;

  const update = (i, field, value) => {
    const arr = [...assignments];
    arr[i][field] = value;
    setAssignments(arr);
  };

  const handleSubmit = async () => {
    if (!isValid) return alert(`Les heures allouées (${totalAllocated}h) ne correspondent pas au total du projet (${projectTotal}h) !`);
    await api.post('/assignments', { project_id: id, assignments });
    const res = await api.get(`/assignments/${id}`);
    setSaved(res.data);
    alert('Allocation sauvegardée !');
  };

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <a href="/projects" style={{ color: '#1a73e8' }}>← Retour aux projets</a>
      <h2 style={{ color: '#1a73e8' }}>👥 Allocation des Heures — Projet #{id}</h2>
      <p>Total projet : <strong>{projectTotal}h</strong> | Alloué : <strong style={{ color: isValid ? '#28a745' : '#dc3545' }}>{totalAllocated}h {isValid ? '✅' : '❌'}</strong></p>

      {assignments.map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, background: '#f8f9fa', padding: 10, borderRadius: 8 }}>
          <select value={a.member_id} onChange={e => update(i, 'member_id', e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd', flex: 2 }}>
            <option value="">Choisir membre</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
          </select>
          <input placeholder="Heures" type="number" value={a.allocated_hours} onChange={e => update(i, 'allocated_hours', e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd', flex: 1 }} />
          <input placeholder="Rôle" value={a.role} onChange={e => update(i, 'role', e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd', flex: 1 }} />
          <input type="date" value={a.start_date} onChange={e => update(i, 'start_date', e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd', flex: 1 }} />
          <button onClick={() => setAssignments(assignments.filter((_, j) => j !== i))} style={{ padding: 8, background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>✕</button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={() => setAssignments([...assignments, { member_id: '', allocated_hours: '', role: '', start_date: '' }])}
          style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Ajouter membre
        </button>
        <button onClick={handleSubmit} disabled={!isValid}
          style={{ padding: '10px 30px', background: isValid ? '#28a745' : '#ccc', color: '#fff', border: 'none', borderRadius: 4, cursor: isValid ? 'pointer' : 'not-allowed' }}>
          Sauvegarder ✅
        </button>
      </div>

      {saved.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Équipe assignée :</h3>
          {saved.map(s => <p key={s.id}>👤 <strong>{s.name}</strong> — {s.allocated_hours}h — {s.role}</p>)}
        </div>
      )}
    </div>
  );
}
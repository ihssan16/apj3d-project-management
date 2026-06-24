import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api';

export default function Reports() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [members, setMembers] = useState([]);
  const [lag, setLag] = useState([]);

  useEffect(() => {
    api.get(`/reports/summary/${id}`).then(r => setSummary(r.data));
    api.get(`/reports/members/${id}`).then(r => setMembers(r.data));
    api.get(`/reports/lag/${id}`).then(r => setLag(r.data));
  }, [id]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`APJ3D — Project Report #${id}`, 14, 20);
    if (summary) {
      doc.setFontSize(12);
      doc.text(`Project: ${summary.name} | Status: ${summary.status}`, 14, 30);
      doc.text(`Total Hours: ${summary.total_hours}h | Logged: ${summary.total_logged}h | Breaches: ${summary.total_breaches}`, 14, 38);
    }
    autoTable(doc, {
      startY: 50,
      head: [['Member', 'Allocated', 'Used', 'Score', 'Tag', 'Breaches']],
      body: members.map(r => [r.name, `${r.allocated_hours}h`, `${r.hours_used}h`, `${parseFloat(r.score).toFixed(1)}/80`, r.status_tag, r.breach_count])
    });
    if (lag.length > 0) {
      doc.text('Lag Attribution Report', 14, doc.lastAutoTable.finalY + 15);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Member', 'Task', 'Original Deadline', 'Reason']],
        body: lag.map(l => [l.member_name, l.task_title, l.original_deadline?.split('T')[0], l.reason])
      });
    }
    doc.save(`apj3d_report_project_${id}.pdf`);
  };

  const chartData = members.map(r => ({ name: r.name, Allouées: parseFloat(r.allocated_hours), Utilisées: parseFloat(r.hours_used) }));

  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <a href="/projects" style={{ color: '#1a73e8' }}>← Retour aux projets</a>
      <h2 style={{ color: '#1a73e8' }}>📈 Rapports — Projet #{id}</h2>

      {summary && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 20 }}>
          <h3>📋 Résumé du Projet</h3>
          <p>Nom : <strong>{summary.name}</strong> | Statut : <strong>{summary.status}</strong></p>
          <p>Heures budget : <strong>{summary.total_hours}h</strong> | Heures utilisées : <strong>{summary.total_logged}h</strong></p>
          <p>Total breaches : <strong style={{ color: '#dc3545' }}>{summary.total_breaches}</strong></p>
        </div>
      )}

      <button onClick={exportPDF} style={{ marginBottom: 20, padding: '10px 25px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 15 }}>
        📄 Exporter PDF
      </button>

      <h3>Heures : Allouées vs Utilisées</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
          <Bar dataKey="Allouées" fill="#1a73e8" />
          <Bar dataKey="Utilisées" fill="#dc3545" />
        </BarChart>
      </ResponsiveContainer>

      {lag.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>🚨 Lag Attribution Report</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#dc3545', color: '#fff' }}>
              <tr>{['Membre', 'Tâche', 'Deadline originale', 'Raison'].map(h => <th key={h} style={{ padding: 10, textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {lag.map((l, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff5f5' : '#fff' }}>
                  <td style={{ padding: 10 }}>{l.member_name}</td>
                  <td style={{ padding: 10 }}>{l.task_title}</td>
                  <td style={{ padding: 10 }}>{l.original_deadline?.split('T')[0]}</td>
                  <td style={{ padding: 10 }}>{l.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
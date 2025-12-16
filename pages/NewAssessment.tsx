import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { Card, Button } from '../components/ui';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { Assessment } from '../types';

export const NewAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, currentUser } = useStore();
  
  const client = clients.find(c => c.id === id);

  const [form, setForm] = useState({
    risk_level: 'MEDIUM' as 'LOW'|'MEDIUM'|'HIGH',
    needs_summary: '',
    living_situation: '',
    notes: ''
  });

  if (!client) return <div>Client not found</div>;

  const handleSubmit = () => {
    // 1. Run AI Analysis immediately
    const analysisText = `${form.needs_summary} ${form.notes} ${form.living_situation}`;
    const analysis = store.analyzeAssessment(analysisText);

    // 2. Create Draft Assessment
    const newAssessment: Assessment = {
      id: `as-${Date.now()}`,
      client_id: client.id,
      performed_by_name: currentUser.name,
      assessment_date: new Date().toISOString().split('T')[0],
      type: 'INITIAL',
      risk_level: form.risk_level,
      needs_summary: form.needs_summary,
      notes: `Living Situation: ${form.living_situation}. \nNotes: ${form.notes}`,
      recommended_product_ids: [], // Filled in next step via AI selection
      status: 'DRAFT',
      created_at: new Date().toISOString(),
      ai_analysis: analysis
    };

    store.addAssessment(newAssessment);
    
    // 3. Navigate to Review
    navigate(`/clients/${client.id}/assessment/${newAssessment.id}/review`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
           <ArrowLeft className="w-4 h-4" /> Cancel
        </Button>
        <h2 className="text-xl font-bold text-slate-900">New Assessment for {client.full_name}</h2>
      </div>

      <Card className="p-8 space-y-6">
        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Risk Level (Nurse Assessment)</label>
           <select 
              className="w-full border border-slate-300 rounded-md p-2 text-sm"
              value={form.risk_level}
              onChange={e => setForm({...form, risk_level: e.target.value as any})}
           >
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Needs Summary</label>
           <p className="text-xs text-slate-500 mb-2">Describe the client's condition, mobility, and cognitive state.</p>
           <textarea 
              className="w-full border border-slate-300 rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="E.g. Client lives alone, has history of falls in bathroom. Forgetful with medication..."
              value={form.needs_summary}
              onChange={e => setForm({...form, needs_summary: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Living Situation</label>
           <input 
              type="text"
              className="w-full border border-slate-300 rounded-md p-2 text-sm"
              placeholder="E.g. Apartment, ground floor, lives with spouse..."
              value={form.living_situation}
              onChange={e => setForm({...form, living_situation: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-1">Additional Notes</label>
           <textarea 
              className="w-full border border-slate-300 rounded-md p-3 text-sm h-24"
              placeholder="Any specific requests or family concerns..."
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
           />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
           <Button onClick={handleSubmit} disabled={!form.needs_summary} className="bg-brand-600 hover:bg-brand-700 text-white px-6">
              <BrainCircuit className="w-4 h-4 mr-2" /> Run AI Analysis & Continue
           </Button>
        </div>
      </Card>
    </div>
  );
};
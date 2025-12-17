
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
    const analysisText = `${form.needs_summary} ${form.notes} ${form.living_situation}`;
    const analysis = store.analyzeAssessment(analysisText);

    const newAssessment: Assessment = {
      id: `as-${Date.now()}`,
      client_id: client.id,
      performed_by_name: currentUser.name,
      assessment_date: new Date().toISOString().split('T')[0],
      type: 'INITIAL',
      risk_level: form.risk_level,
      needs_summary: form.needs_summary,
      notes: `Living Situation: ${form.living_situation}. \nNotes: ${form.notes}`,
      recommended_product_ids: [],
      status: 'DRAFT',
      created_at: new Date().toISOString(),
      ai_analysis: analysis
    };

    store.addAssessment(newAssessment);
    navigate(`/clients/${client.id}/assessment/${newAssessment.id}/review`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-slate-300">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <div>
           <h2 className="text-2xl font-bold text-slate-900">New Clinical Assessment</h2>
           <p className="text-slate-500 text-sm">For {client.full_name}</p>
        </div>
      </div>

      <Card className="p-8 shadow-lg border-slate-200 space-y-8">
        <div>
           <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Risk Level (Nurse Evaluation)</label>
           <div className="grid grid-cols-3 gap-4">
              {['LOW', 'MEDIUM', 'HIGH'].map(level => (
                 <button
                    key={level}
                    onClick={() => setForm({...form, risk_level: level as any})}
                    className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                       form.risk_level === level
                       ? level === 'HIGH' ? 'bg-red-600 text-white border-red-600' :
                         level === 'MEDIUM' ? 'bg-amber-500 text-white border-amber-500' :
                         'bg-green-600 text-white border-green-600'
                       : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                 >
                    {level} RISK
                 </button>
              ))}
           </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-800 mb-1 uppercase tracking-wide">Clinical Needs Summary</label>
           <p className="text-xs text-slate-500 mb-3">Describe mobility, cognitive state, and specific conditions.</p>
           <textarea 
              className="w-full border border-slate-300 rounded-xl p-4 text-sm h-32 focus:ring-2 focus:ring-brand-500 outline-none resize-none bg-slate-50"
              placeholder="E.g. Client lives alone, has history of falls in bathroom. Forgetful with medication..."
              value={form.needs_summary}
              onChange={e => setForm({...form, needs_summary: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Living Situation</label>
           <input 
              type="text"
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-slate-50"
              placeholder="E.g. Apartment, ground floor, lives with spouse..."
              value={form.living_situation}
              onChange={e => setForm({...form, living_situation: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Additional Notes</label>
           <textarea 
              className="w-full border border-slate-300 rounded-xl p-4 text-sm h-24 focus:ring-2 focus:ring-brand-500 outline-none resize-none bg-slate-50"
              placeholder="Any specific requests or family concerns..."
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
           />
        </div>

        <div className="pt-8 border-t border-slate-100 flex justify-end">
           <Button onClick={handleSubmit} disabled={!form.needs_summary} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 h-auto text-base font-bold shadow-lg">
              <BrainCircuit className="w-5 h-5 mr-2" /> Run AI Analysis & Continue
           </Button>
        </div>
      </Card>
    </div>
  );
};

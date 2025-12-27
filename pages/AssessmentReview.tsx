import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { ArrowLeft, CheckCircle, BrainCircuit, AlertTriangle, Package, Activity } from 'lucide-react';

export const AssessmentReview: React.FC = () => {
  const { id, assessmentId } = useParams<{ id: string; assessmentId: string }>();
  const navigate = useNavigate();
  const { assessments, clients, products } = useStore();

  const assessment = assessments.find(a => a.id === assessmentId);
  const client = clients.find(c => c.id === id);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    assessment?.ai_analysis?.suggested_product_ids || []
  );

  if (!assessment || !client) return <div>Data not found</div>;

  const analysis = assessment.ai_analysis!;

  const handleConfirm = () => {
    store.approveAssessment(assessment.id, selectedProductIds);
    store.createCarePlanFromAssessment(assessment.id, {
       agreed_product_ids: selectedProductIds
    });
    navigate(`/clients/${client.id}/care-plan/review`);
  };

  const toggleProduct = (pid: string) => {
    if (selectedProductIds.includes(pid)) setSelectedProductIds(selectedProductIds.filter(d => d !== pid));
    else setSelectedProductIds([...selectedProductIds, pid]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6 pt-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-slate-300">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Assessment Review</h2>
           <p className="text-slate-500">AI analysis complete. Please verify recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* LEFT: CLINICAL INPUT */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
               <Activity className="w-5 h-5 text-slate-400" /> Clinical Data
            </h3>
            <Card className="p-8 space-y-6 bg-slate-50 border-slate-200 shadow-sm">
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nurse Assessment</h4>
                  <p className="text-base text-slate-800 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-200">{assessment.needs_summary}</p>
               </div>
               <div className="flex gap-6">
                  <div className="flex-1">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Risk Level</h4>
                     <Badge color={assessment.risk_level === 'HIGH' ? 'red' : 'yellow'}>{assessment.risk_level} RISK</Badge>
                  </div>
                  <div className="flex-[2]">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
                     <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">{assessment.notes}</p>
                  </div>
               </div>
            </Card>
         </div>

         {/* RIGHT: AI ANALYSIS */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
               <BrainCircuit className="w-5 h-5 text-brand-600" /> AI Intake Analysis
            </h3>
            <Card className="p-8 space-y-8 border-brand-200 shadow-md">
               {/* Reasoning Box */}
               <div className="bg-brand-50 p-5 rounded-xl border border-brand-100">
                  <div className="flex justify-between items-center mb-4">
                     <h4 className="text-xs font-bold text-brand-800 uppercase tracking-wider">Analysis Summary</h4>
                     <span className="text-xs font-bold bg-white px-2 py-1 rounded text-brand-600 border border-brand-100">Confidence: {(analysis.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="space-y-2 mb-4">
                     {analysis.reasoning && analysis.reasoning.map((reason, idx) => (
                        <p key={idx} className="text-sm text-brand-900 leading-relaxed flex gap-2">
                           <span className="text-brand-400 mt-1">•</span> {reason}
                        </p>
                     ))}
                  </div>
                  {analysis.risk_flags.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-200/50">
                        {analysis.risk_flags.map((flag, i) => (
                           <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md border border-red-200">
                              <AlertTriangle className="w-3.5 h-3.5" /> {flag}
                           </span>
                        ))}
                     </div>
                  )}
               </div>

               {/* Product Selection */}
               <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                     <Package className="w-4 h-4 text-slate-400" /> Product Selection
                  </h4>
                  <div className="space-y-3">
                     {products.map(product => {
                        const isRecommended = analysis.suggested_product_ids.includes(product.id);
                        const isSelected = selectedProductIds.includes(product.id);
                        
                        return (
                           <div 
                              key={product.id} 
                              onClick={() => toggleProduct(product.id)}
                              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                 isSelected 
                                 ? 'bg-green-50 border-green-200 ring-1 ring-green-500 shadow-sm' 
                                 : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}>
                                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                                 </div>
                                 <div>
                                    <span className={`text-sm font-bold block ${isSelected ? 'text-green-900' : 'text-slate-700'}`}>{product.name}</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-medium">{product.category.replace('_', ' ')}</span>
                                 </div>
                              </div>
                              {isRecommended && <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-1 rounded font-bold border border-brand-200">SUGGESTED</span>}
                           </div>
                        );
                     })}
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-100">
                  <Button onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg font-bold shadow-lg rounded-xl">
                     Approve Plan & Continue
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

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

  // Local state for the final selection (Nurse can override AI)
  // Default to AI suggestions from the new analysis structure
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    assessment?.ai_analysis?.suggested_product_ids || []
  );

  if (!assessment || !client) return <div>Data not found</div>;

  const analysis = assessment.ai_analysis!;

  const handleConfirm = () => {
    // 1. Update Assessment status to APPROVED
    store.approveAssessment(assessment.id, selectedProductIds);
    
    // 2. Create Care Plan draft from assessment
    store.createCarePlanFromAssessment(assessment.id, {
       agreed_product_ids: selectedProductIds
    });

    // 3. Navigate to Care Plan Review
    navigate(`/clients/${client.id}/care-plan/review`);
  };

  const toggleProduct = (pid: string) => {
    if (selectedProductIds.includes(pid)) setSelectedProductIds(selectedProductIds.filter(d => d !== pid));
    else setSelectedProductIds([...selectedProductIds, pid]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
           <ArrowLeft className="w-4 h-4" /> Back to Edit
        </Button>
        <h2 className="text-xl font-bold text-slate-900">Review Assessment & AI Recommendations</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* LEFT: NURSE INPUT (READ ONLY) */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Activity className="w-5 h-5 text-slate-500" /> Clinical Input
            </h3>
            <Card className="p-6 space-y-4 bg-slate-50 border-slate-200">
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Nurse Assessment</h4>
                  <p className="text-sm text-slate-800 leading-relaxed">{assessment.needs_summary}</p>
               </div>
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Risk Level Identified</h4>
                  <Badge color={assessment.risk_level === 'HIGH' ? 'red' : 'yellow'}>{assessment.risk_level} RISK</Badge>
               </div>
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Notes</h4>
                  <p className="text-xs text-slate-600 italic">{assessment.notes}</p>
               </div>
            </Card>
         </div>

         {/* RIGHT: AI ANALYSIS (INTERACTIVE) */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <BrainCircuit className="w-5 h-5 text-brand-600" /> AI Intake Analysis
            </h3>
            <Card className="p-6 space-y-6 border-brand-200 shadow-md">
               {/* Reasoning Box */}
               <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
                  <h4 className="text-xs font-bold text-brand-800 uppercase mb-2 flex justify-between">
                     Analysis Summary
                     <span className="text-brand-600">Confidence: {(analysis.confidence * 100).toFixed(0)}%</span>
                  </h4>
                  <div className="space-y-1 mb-3">
                     {analysis.reasoning && analysis.reasoning.map((reason, idx) => (
                        <p key={idx} className="text-sm text-brand-900 leading-relaxed flex gap-2">
                           <span className="text-brand-400">•</span> {reason}
                        </p>
                     ))}
                  </div>
                  {analysis.risk_flags.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.risk_flags.map((flag, i) => (
                           <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200">
                              <AlertTriangle className="w-3 h-3" /> {flag}
                           </span>
                        ))}
                     </div>
                  )}
               </div>

               {/* Product Selection */}
               <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                     <Package className="w-4 h-4 text-slate-500" /> Recommended Products
                  </h4>
                  <div className="space-y-2">
                     {products.map(product => {
                        const isRecommended = analysis.suggested_product_ids.includes(product.id);
                        const isSelected = selectedProductIds.includes(product.id);
                        
                        return (
                           <div 
                              key={product.id} 
                              onClick={() => toggleProduct(product.id)}
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                 isSelected 
                                 ? 'bg-green-50 border-green-200' 
                                 : 'bg-white border-slate-200 opacity-80 hover:opacity-100'
                              }`}
                           >
                              <div className="flex items-center gap-3">
                                 <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}>
                                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                 </div>
                                 <div>
                                    <span className={`text-sm font-medium block ${isSelected ? 'text-green-900' : 'text-slate-600'}`}>{product.name}</span>
                                    <span className="text-[10px] text-slate-400 uppercase">{product.category.replace('_', ' ')}</span>
                                 </div>
                              </div>
                              {isRecommended && <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded font-bold">SUGGESTED</span>}
                           </div>
                        );
                     })}
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-100">
                  <Button onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg shadow-lg">
                     Confirm Assessment & Create Plan
                  </Button>
                  <p className="text-center text-xs text-slate-400 mt-2">
                     Creating plan will generate a draft for final sign-off.
                  </p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

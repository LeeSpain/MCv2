
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, store } from '../services/store';
import { Card, Button, Badge } from '../components/ui';
import { ArrowLeft, CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import { CaseStatus } from '../types';

export const CarePlanReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, carePlans, currentUser } = useStore();
  
  const client = clients.find(c => c.id === id);
  // Get the latest plan (just created)
  const plan = carePlans.find(p => p.client_id === id && p.status === 'ACTIVE');

  const [orderMode, setOrderMode] = useState(false);

  if (!client || !plan) return <div>Plan not found.</div>;

  const handleOrder = () => {
    store.createCase({
      id: `c${Date.now()}`,
      client_id: client.id,
      client_name: client.full_name,
      care_company_id: currentUser.care_company_id,
      status: CaseStatus.NEW,
      created_at: new Date().toLocaleDateString(),
      product_ids: plan.agreed_product_ids,
      line_items: plan.agreed_product_ids.map((pid, idx) => ({
        id: `li-${Date.now()}-${idx}`,
        product_id: pid,
        requested_qty: 1,
        allocated_device_ids: [],
        status: 'REQUESTED'
      }))
    });
    // Navigate to order success/dashboard
    navigate('/orders');
  };

  const handleLater = () => {
    navigate(`/clients/${client.id}`);
  };

  const itemNames = store.getProductIdsToNames(plan.agreed_product_ids);

  if (orderMode) {
     return (
        <div className="max-w-2xl mx-auto pt-20 text-center space-y-8">
           <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-600 border border-brand-100 shadow-sm">
              <Truck className="w-12 h-12" />
           </div>
           <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Ready to Place Order?</h2>
              <p className="text-slate-500 text-lg">
                 MobileCare can immediately prepare and ship the following items:
              </p>
           </div>
           
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-left max-w-md mx-auto">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Shipment Manifest</h4>
              <ul className="space-y-3">
                 {itemNames.map((name, idx) => (
                    <li key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                       <div className="p-1 bg-green-100 rounded-full text-green-600"><CheckCircle className="w-4 h-4" /></div>
                       <span className="font-bold text-slate-800">{name}</span>
                    </li>
                 ))}
              </ul>
           </div>

           <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={handleLater} className="w-32 h-12 font-bold text-slate-600 border-slate-300">Not Yet</Button>
              <Button onClick={handleOrder} className="w-56 h-12 bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg">
                 Yes, Place Order
              </Button>
           </div>
        </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4 text-green-800 shadow-sm">
         <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="w-6 h-6 text-green-600" /></div>
         <span className="font-bold text-lg">Care Plan Activated Successfully</span>
      </div>

      <Card className="p-10 shadow-lg border-slate-200">
         <div className="border-b border-slate-100 pb-8 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Care Plan Summary</h2>
            <p className="text-slate-500">Effective from {plan.created_at}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Primary Goals</h4>
               <p className="text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{plan.goals}</p>
            </div>
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Review Schedule</h4>
               <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-sm">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="font-bold text-slate-700">Every {plan.review_interval_days} days</span>
               </div>
            </div>
         </div>

         <div className="mb-10">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Agreed Equipment</h4>
            <div className="flex flex-wrap gap-3">
               {itemNames.map((name, idx) => (
                  <Badge key={idx} color="blue">{name}</Badge>
               ))}
            </div>
         </div>

         <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate(`/clients/${client.id}`)} className="font-bold text-slate-600 h-12 px-6">
               Return to Profile
            </Button>
            <Button onClick={() => setOrderMode(true)} className="bg-brand-600 hover:bg-brand-700 text-white px-10 h-12 text-base font-bold shadow-lg rounded-xl">
               Proceed to Order <Package className="w-5 h-5 ml-2" />
            </Button>
         </div>
      </Card>
    </div>
  );
};

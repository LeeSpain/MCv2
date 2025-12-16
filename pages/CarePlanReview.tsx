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
      items: plan.agreed_devices
    });
    // Navigate to order success/dashboard
    navigate('/orders');
  };

  const handleLater = () => {
    navigate(`/clients/${client.id}`);
  };

  if (orderMode) {
     return (
        <div className="max-w-2xl mx-auto pt-16 text-center space-y-6">
           <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto text-brand-600">
              <Truck className="w-10 h-10" />
           </div>
           <h2 className="text-2xl font-bold text-slate-900">Ready to Order?</h2>
           <p className="text-slate-600">
              MobileCare can immediately prepare and ship the following items based on the active Care Plan:
           </p>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left max-w-md mx-auto">
              <h4 className="font-bold text-sm text-slate-500 uppercase mb-3">Shipment Manifest</h4>
              <ul className="space-y-2">
                 {plan.agreed_devices.map(d => (
                    <li key={d} className="flex items-center gap-3">
                       <CheckCircle className="w-4 h-4 text-green-500" />
                       <span className="font-medium text-slate-900">{d}</span>
                    </li>
                 ))}
              </ul>
           </div>

           <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={handleLater} className="w-32">Not Yet</Button>
              <Button onClick={handleOrder} className="w-48 bg-green-600 hover:bg-green-700 text-white shadow-lg">
                 Yes, Place Order
              </Button>
           </div>
        </div>
     );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-800 mb-6">
         <CheckCircle className="w-5 h-5" />
         <span className="font-bold">Care Plan Activated Successfully</span>
      </div>

      <Card className="p-8 space-y-8">
         <div className="border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Care Plan Summary</h2>
            <p className="text-slate-500">Effective from {plan.created_at}</p>
         </div>

         <div className="grid grid-cols-2 gap-8">
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Goals</h4>
               <p className="text-slate-800 font-medium">{plan.goals}</p>
            </div>
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Review Schedule</h4>
               <p className="text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" /> Every {plan.review_interval_days} days
               </p>
            </div>
         </div>

         <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Agreed Equipment</h4>
            <div className="flex flex-wrap gap-2">
               {plan.agreed_devices.map(d => (
                  <Badge key={d} color="blue">{d}</Badge>
               ))}
            </div>
         </div>

         <div className="pt-8 flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate(`/clients/${client.id}`)}>
               Return to Profile
            </Button>
            <Button onClick={() => setOrderMode(true)} className="bg-brand-600 hover:bg-brand-700 text-white px-8">
               Proceed to Order <Package className="w-4 h-4 ml-2" />
            </Button>
         </div>
      </Card>
    </div>
  );
};
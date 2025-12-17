
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { ArrowLeft, CheckCircle, Package } from 'lucide-react';
import { CaseStatus } from '../types';

export const CareNewOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, currentUser, products } = useStore();
  
  const client = clients.find(c => c.id === id);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!client) return <div>Client not found</div>;

  const toggleItem = (pid: string) => {
    if (selectedProductIds.includes(pid)) {
      setSelectedProductIds(selectedProductIds.filter(i => i !== pid));
    } else {
      setSelectedProductIds([...selectedProductIds, pid]);
    }
  };

  const handleSubmit = () => {
    store.createCase({
      id: `c${Date.now()}`,
      client_id: client.id,
      client_name: client.full_name,
      care_company_id: currentUser.care_company_id,
      status: CaseStatus.NEW,
      created_at: new Date().toLocaleDateString(),
      product_ids: selectedProductIds,
      line_items: selectedProductIds.map((pid, idx) => ({
        id: `li-${Date.now()}-${idx}`,
        product_id: pid,
        requested_qty: 1,
        allocated_device_ids: [],
        status: 'REQUESTED'
      }))
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto pt-20 text-center">
        <div className="bg-green-100 p-8 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Order Submitted</h2>
        <p className="text-slate-600 mb-10 text-lg">MobileCare has received your request and will handle the logistics.<br/>You can track status in Active Orders.</p>
        <div className="flex justify-center gap-6">
           <Button onClick={() => navigate('/clients')} variant="outline" className="h-12 px-8 text-base font-bold">Back to Clients</Button>
           <Button onClick={() => navigate('/orders')} className="bg-brand-600 text-white h-12 px-8 text-base font-bold shadow-lg">View Orders</Button>
        </div>
      </div>
    );
  }

  const availableProducts = products.filter(p => p.is_active);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-full w-10 h-10 p-0 flex items-center justify-center border-slate-300">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <div>
           <h2 className="text-2xl font-bold text-slate-900">New Order for {client.full_name}</h2>
           <p className="text-slate-500 text-sm">Select required devices and services.</p>
        </div>
      </div>

      <Card className="p-8 shadow-lg border-slate-200">
         <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
               <Package className="w-4 h-4 text-brand-600" /> Available Catalog
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {availableProducts.map(p => {
                 const isSelected = selectedProductIds.includes(p.id);
                 return (
                   <div 
                     key={p.id} 
                     onClick={() => toggleItem(p.id)}
                     className={`p-5 border rounded-xl cursor-pointer transition-all flex justify-between items-center group ${
                        isSelected 
                        ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500 shadow-sm' 
                        : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                     }`}
                   >
                      <div>
                         <span className={`font-bold block mb-1 ${isSelected ? 'text-brand-900' : 'text-slate-800'}`}>{p.name}</span>
                         <span className="text-xs text-slate-500 uppercase font-medium">{p.category.replace('_', ' ')}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                         isSelected ? 'bg-brand-600 border-brand-600' : 'bg-white border-slate-300 group-hover:border-brand-300'
                      }`}>
                         {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>

         <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Operational Notes</h3>
            <textarea 
               className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none bg-slate-50"
               rows={4}
               placeholder="E.g., Client requires installation in the morning, specific access codes..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
            />
         </div>

         <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <div className="text-sm text-slate-500 font-medium">
               {selectedProductIds.length} items selected
            </div>
            <Button onClick={handleSubmit} disabled={selectedProductIds.length === 0} className="px-8 py-3 h-auto text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md">
               Submit Order
            </Button>
         </div>
      </Card>
    </div>
  );
};

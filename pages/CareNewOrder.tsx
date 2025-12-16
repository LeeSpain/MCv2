
import React, { useState } from 'react';
import { useStore, store } from '../services/store';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { ArrowLeft, CheckCircle } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto pt-12 text-center">
        <div className="bg-green-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Submitted</h2>
        <p className="text-slate-600 mb-8">MobileCare has received your request and will handle the logistics. You can track status in Active Orders.</p>
        <div className="flex justify-center gap-4">
           <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
           <Button variant="outline" onClick={() => navigate('/orders')}>View Orders</Button>
        </div>
      </div>
    );
  }

  // Filter out services/products that might not be selectable in this quick flow if needed
  // For now, show all active products
  const availableProducts = products.filter(p => p.is_active);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
      </Button>

      <div>
        <h2 className="text-2xl font-bold text-slate-900">New Order for {client.full_name}</h2>
        <p className="text-slate-500">Select the devices and services required for this client.</p>
      </div>

      <Card className="p-6 space-y-6">
         <div>
            <h3 className="font-bold text-slate-800 mb-4">Select Devices & Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {availableProducts.map(p => (
                 <div 
                   key={p.id} 
                   onClick={() => toggleItem(p.id)}
                   className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedProductIds.includes(p.id) ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-300'}`}
                 >
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-slate-900">{p.name}</span>
                       {selectedProductIds.includes(p.id) && <CheckCircle className="w-5 h-5 text-brand-600" />}
                    </div>
                    <p className="text-xs text-slate-500">{p.category.replace('_', ' ')}</p>
                 </div>
               ))}
            </div>
         </div>

         <div>
            <h3 className="font-bold text-slate-800 mb-2">Notes for MobileCare (Optional)</h3>
            <textarea 
               className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
               rows={3}
               placeholder="E.g., Client requires installation in the morning..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
            />
         </div>

         <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button onClick={handleSubmit} disabled={selectedProductIds.length === 0} className="w-full md:w-auto">
               Submit Order Request
            </Button>
         </div>
      </Card>
    </div>
  );
};

import React from 'react';
import { Card } from '../components/ui';

export const Messages: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800">Communications</h3>
      <Card className="p-12 text-center border-dashed">
         <p className="text-slate-500">Messaging inbox and template management coming in Phase 2.</p>
      </Card>
    </div>
  );
};

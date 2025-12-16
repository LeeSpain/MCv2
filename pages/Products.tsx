
import React from "react";
import { store } from "../services/store";
import { Badge, Button } from "../components/ui";
import { Plus } from "lucide-react";
import { ProductCategory } from "../types";

export const Products: React.FC = () => {
  const products = store.products;

  const handleAddProduct = () => {
      const name = prompt("Enter Product Name:");
      if (name) {
          store.addProduct({
              id: `prod-${Date.now()}`,
              name,
              category: ProductCategory.SAFETY,
              is_device: true,
              is_active: true,
              requires_hub: false,
              requires_subscription: false
          });
      }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
            <p className="text-slate-600 mt-1">
                Central definitions used by stock, orders, care plans, and AI recommendations.
            </p>
        </div>
        <Button size="sm" onClick={handleAddProduct}><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">ID</th>
              <th className="p-4">Category</th>
              <th className="p-4">Type</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Hub Req.</th>
              <th className="p-4">Sub Req.</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{p.name}</td>
                <td className="p-4 text-slate-500 font-mono text-xs">{p.id}</td>
                <td className="p-4 text-slate-600"><Badge color="blue">{p.category.replace('_', ' ')}</Badge></td>
                <td className="p-4 text-slate-600">{p.is_device ? "Device" : "Service"}</td>
                <td className="p-4 text-slate-600">{p.supplier ?? "-"}</td>
                <td className="p-4 text-slate-600">{p.requires_hub ? "Yes" : "No"}</td>
                <td className="p-4 text-slate-600">{p.requires_subscription ? "Yes" : "No"}</td>
                <td className="p-4 text-slate-600">
                    {p.is_active ? <span className="text-green-600 font-bold text-xs">Active</span> : <span className="text-slate-400">Inactive</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

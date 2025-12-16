import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string, noPadding?: boolean }> = ({ children, className = '', title, noPadding = false }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {title && <div className="px-5 py-3 border-b border-slate-100 font-semibold text-sm text-slate-800 flex justify-between items-center">{title}</div>}
    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode, color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' }> = ({ children, color = 'gray' }) => {
  const styles = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-slate-50 text-slate-600 border-slate-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${styles[color]}`}>
      {children}
    </span>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline', size?: 'sm' | 'md' }> = ({ 
  children, variant = 'primary', size = 'md', className = '', ...props 
}) => {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm border border-transparent',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent',
    outline: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm'
  };
  return (
    <button 
      className={`rounded-md font-medium transition-all focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 disabled:opacity-50 flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Stat: React.FC<{ label: string, value: string | number, trend?: string, color?: string, icon?: React.ReactNode }> = ({ label, value, trend, color = 'text-slate-900', icon }) => (
  <div className="flex items-start justify-between">
    <div>
       <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</dt>
       <dd className={`text-2xl font-bold tracking-tight ${color}`}>{value}</dd>
       {trend && <span className="text-[10px] text-green-600 mt-1 font-medium block">{trend}</span>}
    </div>
    {icon && <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>}
  </div>
);
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string, noPadding?: boolean, subtitle?: string }> = ({ children, className = '', title, subtitle, noPadding = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md ${className}`}>
    {title && (
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
        <div>
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>}
        </div>
      </div>
    )}
    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode, color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'cyan' }> = ({ children, color = 'gray' }) => {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    gray: 'bg-slate-50 text-slate-600 border-slate-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${styles[color]}`}>
      {children}
    </span>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }> = ({ 
  children, variant = 'primary', size = 'md', className = '', ...props 
}) => {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md border-transparent active:scale-95',
    secondary: 'bg-slate-900 text-white hover:bg-black shadow-md border-transparent active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md border-transparent active:scale-95',
    outline: 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-95',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider',
    md: 'px-5 py-2.5 text-sm font-bold',
    lg: 'px-8 py-4 text-base font-black uppercase tracking-widest'
  };
  return (
    <button 
      className={`rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Stat: React.FC<{ label: string, value: string | number, trend?: string, color?: string, icon?: React.ReactNode, positive?: boolean }> = ({ label, value, trend, color = 'text-slate-900', icon, positive = true }) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex-1 min-w-0">
       <dt className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">{label}</dt>
       <dd className={`text-2xl md:text-3xl font-black tracking-tighter italic ${color}`}>{value}</dd>
       {trend && (
         <span className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
           {positive ? '↑' : '↓'} {trend}
         </span>
       )}
    </div>
    {icon && (
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100 shadow-inner shrink-0 ml-4">
        {icon}
      </div>
    )}
  </div>
);

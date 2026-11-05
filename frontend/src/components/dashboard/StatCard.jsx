import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'pink', change, subtitle }) => {
  const colorMap = {
    pink: {
      bg: 'bg-gradient-to-tr from-brand-50 to-white',
      border: 'border-brand-200',
      iconBg: 'bg-brand-500 text-white',
      badge: 'bg-brand-100 text-brand-700',
    },
    blue: {
      bg: 'bg-gradient-to-tr from-blue-50 to-white',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500 text-white',
      badge: 'bg-blue-100 text-blue-700',
    },
    emerald: {
      bg: 'bg-gradient-to-tr from-emerald-50 to-white',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500 text-white',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    amber: {
      bg: 'bg-gradient-to-tr from-amber-50 to-white',
      border: 'border-amber-200',
      iconBg: 'bg-amber-500 text-white',
      badge: 'bg-amber-100 text-amber-700',
    },
  };

  const scheme = colorMap[color] || colorMap.pink;

  return (
    <div
      className={`p-6 rounded-2xl border ${scheme.border} ${scheme.bg} shadow-soft-pink hover:shadow-lg transition-all duration-200 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${scheme.iconBg} flex items-center justify-center shadow-md`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center text-xs">
          <span className={`px-2 py-0.5 rounded-full font-bold ${scheme.badge}`}>
            {change}
          </span>
          <span className="text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

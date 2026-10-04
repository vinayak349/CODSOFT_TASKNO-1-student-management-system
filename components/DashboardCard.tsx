import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'positive',
  color = 'blue',
}) => {
  const colorMap = {
    blue: 'from-blue-500/10 to-indigo-500/5 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30',
    purple: 'from-purple-500/10 to-fuchsia-500/5 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30',
    indigo: 'from-indigo-500/10 to-sky-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30',
  };

  const iconBgMap = {
    blue: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400',
    rose: 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400',
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color]} bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${iconBgMap[color]}`}>{icon}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</h3>
        {(subtitle || trend) && (
          <div className="mt-1.5 flex items-center text-xs">
            {trend && (
              <span
                className={`font-semibold mr-2 ${
                  trendType === 'positive'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : trendType === 'negative'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {trend}
              </span>
            )}
            {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

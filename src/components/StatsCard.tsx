import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'default';
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'info',
  accentColor = 'navy',
}) => {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'info':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#173B65] via-[#255792] to-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#173B65] tracking-tight">
              {value}
            </h3>
            {badge && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-[#173B65]/10 flex items-center justify-center text-[#173B65] border border-slate-100 transition-colors shrink-0">
          <Icon className="w-6 h-6 stroke-[1.8]" />
        </div>
      </div>
    </div>
  );
};

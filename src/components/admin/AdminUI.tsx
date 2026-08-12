import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminPageShellProps = {
  children: ReactNode;
  className?: string;
};

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  eyebrow?: string;
};

type AdminPanelProps = {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
};

type AdminStatCardProps = {
  title: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red" | "purple" | "slate";
  helper?: ReactNode;
};

type AdminStatusBadgeProps = {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "purple" | "slate";
  icon?: LucideIcon;
  className?: string;
};

type AdminEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

const toneClasses = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-red-200 bg-red-50 text-red-700",
  purple: "border-purple-200 bg-purple-50 text-purple-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

export function AdminPageShell({ children, className }: AdminPageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function AdminPageHeader({ title, description, icon: Icon, actions, eyebrow }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p>}
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h1 className="truncate text-2xl font-semibold tracking-normal text-slate-950 md:text-3xl">{title}</h1>
        </div>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
    </div>
  );
}

export function AdminPanel({ children, className, header }: AdminPanelProps) {
  return (
    <section className={cn("overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      {header && <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">{header}</div>}
      {children}
    </section>
  );
}

export function AdminStatCard({ title, value, icon: Icon, tone = "slate", helper }: AdminStatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", toneClasses[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-semibold tracking-normal text-slate-950">{value}</div>
      {helper && <div className="mt-2 text-xs text-slate-500">{helper}</div>}
    </div>
  );
}

export function AdminStatusBadge({ children, tone = "slate", icon: Icon, className }: AdminStatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", toneClasses[tone], className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

export function AdminEmptyState({ icon: Icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function adminStatusTone(status: string): AdminStatusBadgeProps["tone"] {
  const normalized = status.toLowerCase();
  if (["delivered", "resolved", "active", "visible", "published"].includes(normalized)) return "green";
  if (["processing", "in progress", "shipped", "auto apply", "featured"].includes(normalized)) return "blue";
  if (["pending", "draft", "trending"].includes(normalized)) return "amber";
  if (["cancelled", "closed", "inactive", "hidden"].includes(normalized)) return "red";
  return "slate";
}

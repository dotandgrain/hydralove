import { Droplets } from "lucide-react";

export function Brand() {
  return <div className="flex items-center gap-2 text-[var(--primary-dark)]"><span className="grid size-9 place-items-center rounded-2xl bg-[var(--primary)] text-white"><Droplets size={20} /></span><span className="text-xl font-extrabold tracking-[-0.03em]">HydraLove</span></div>;
}

export function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return <header className="flex items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]"><h1 className="text-[28px] font-extrabold tracking-[-0.04em]">{title}</h1>{action}</header>;
}

export function PrimaryButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`focus-ring tap flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(14,165,183,.22)] transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}

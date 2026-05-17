"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  Database, 
  Settings, 
  LogOut, 
  Mic2,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Users, label: "Agents", href: "/dashboard/agents" },
  { icon: Phone, label: "Phone Numbers", href: "/dashboard/telephony" },
  { icon: Database, label: "Knowledge Base", href: "/dashboard/rag" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen glass border-r border-slate-800/50 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="text-white fill-white" size={20} />
        </div>
        <span className="text-2xl font-bold font-outfit tracking-tight">NAVA</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === item.href 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/10" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform group-hover:scale-110",
              pathname === item.href ? "text-indigo-400" : "text-slate-500"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-hover p-4 rounded-2xl flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-200">Admin User</p>
            <p className="text-xs text-slate-500 truncate">SaaS Plan</p>
          </div>
          <LogOut size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}

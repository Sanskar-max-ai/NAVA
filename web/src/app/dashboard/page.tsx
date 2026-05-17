"use client";

import { 
  BarChart3, 
  Clock, 
  PhoneIncoming, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Mic2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Conversations", value: "1,284", icon: PhoneIncoming, trend: "+12%", color: "text-emerald-400" },
  { label: "Average Latency", value: "480ms", icon: Zap, trend: "-5%", color: "text-amber-400" },
  { label: "Total Minutes", value: "8,420", icon: Clock, trend: "+18%", color: "text-indigo-400" },
  { label: "Success Rate", value: "99.2%", icon: CheckCircle2, trend: "+0.4%", color: "text-emerald-400" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-outfit mb-2">Command Center</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening with your agents today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[2rem] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={cn("p-3 rounded-2xl bg-slate-900", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold font-outfit mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Large Chart Area */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold font-outfit">Conversation Activity</h3>
              <p className="text-sm text-slate-500">Live call volume over the last 24 hours</p>
            </div>
            <select className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 px-2">
            {[40, 60, 45, 90, 65, 80, 50, 70, 85, 60, 40, 55, 75, 95, 80, 70].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
                className="w-full bg-indigo-500/20 rounded-t-lg relative group transition-all duration-300 hover:bg-indigo-500/40"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between text-[10px] text-slate-500 font-mono px-2 uppercase tracking-widest">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>

        {/* Recent Events / Notifications */}
        <div className="glass rounded-[2.5rem] p-8 flex flex-col">
          <h3 className="text-xl font-bold font-outfit mb-6">Real-time Feed</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex gap-4 group cursor-pointer">
                <div className="relative mt-1">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 transition-colors">
                    <Mic2 size={18} className="text-indigo-400" />
                  </div>
                  {item === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">
                    NAVA Agent #0{item} <span className="text-slate-500 font-normal">active in room</span> demo-302
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-tighter">Connected 2m ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 border border-slate-800 rounded-2xl text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-all">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
}


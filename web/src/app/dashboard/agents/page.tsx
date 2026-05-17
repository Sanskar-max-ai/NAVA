"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Play, 
  Settings2, 
  Trash2,
  Cpu,
  Volume2,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const agents = [
  { id: "1", name: "Sales Pro", instructions: "Help users with sales inquiries...", voice: "Puck", status: "active", calls: 420 },
  { id: "2", name: "Support Bot", instructions: "Technical support specialist...", voice: "Kore", status: "idle", calls: 89 },
  { id: "3", name: "Appointment Setter", instructions: "Booking appointments for clinics...", voice: "Fenrir", status: "active", calls: 1250 },
];

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-outfit mb-2">My Agents</h1>
          <p className="text-slate-400">Configure and deploy your AI workforce.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={20} />
          Create New Agent
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search agents by name or instruction..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button className="px-4 py-2 bg-slate-800 rounded-xl text-sm font-medium text-slate-200">All</button>
          <button className="px-4 py-2 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Active</button>
          <button className="px-4 py-2 hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Idle</button>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-[2.5rem] group relative overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-all group-hover:rotate-3">
                  <Cpu className="text-indigo-400" size={28} />
                </div>
                <div className="flex gap-2">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    agent.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                  )}>
                    {agent.status}
                  </div>
                  <button className="p-2 text-slate-500 hover:text-slate-200 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-xl font-bold font-outfit group-hover:text-indigo-400 transition-colors">{agent.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mt-1">{agent.instructions}</p>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-slate-500" />
                    <span className="text-xs text-slate-300">{agent.voice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-slate-500" />
                    <span className="text-xs text-slate-300">{agent.calls} calls</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-bold transition-all active:scale-95">
                  <Settings2 size={16} />
                  Configure
                </button>
                <button className="w-12 h-12 flex items-center justify-center bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl transition-all active:scale-95 group/btn">
                  <Play size={20} className="fill-current" />
                </button>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

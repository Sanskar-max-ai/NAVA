"use client";

import Link from "next/link";
import { Zap, Phone, Brain, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CREATORS = [
  {
    id: "narendra_modi",
    name: "Narendra Modi",
    title: "Leadership & Vision",
    image: "/creators/narendra_modi.jpg",
    description: "Discuss India's growth, governance, and the vision for a digital future.",
    price: "₹499/mo"
  },
  {
    id: "raj_shamani",
    name: "Raj Shamani",
    title: "Business & Podcasting",
    image: "/creators/raj_shamani.jpg",
    description: "Talk about startups, scaling FMCG businesses, sales psychology, and branding.",
    price: "₹399/mo"
  },
  {
    id: "ratan_tata",
    name: "Ratan Tata",
    title: "Business Wisdom & Ethics",
    image: "/creators/ratan_tata.jpg",
    description: "Timeless advice on building ethical businesses, leadership, and philanthropy.",
    price: "₹999/mo"
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white fill-white" size={16} />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight">NAVA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#experts" className="hover:text-white transition-colors">Find Experts</a>
          <a href="#" className="hover:text-white transition-colors">How it Works</a>
          <a href="#" className="hover:text-white transition-colors">For Creators</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <button className="px-3 py-2 sm:px-5 sm:py-2.5 bg-white text-slate-950 hover:bg-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass border border-indigo-500/30 text-indigo-400 text-xs sm:text-sm font-medium mb-4">
            <Sparkles size={14} className="sm:w-4 sm:h-4" />
            <span>The Future of 1-on-1 Mentorship</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-outfit tracking-tight leading-[1.1]">
            Talk with India's <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Top Minds.
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            Get personalized advice, coaching, and mentorship from AI clones of your favorite creators, available 24/7.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#experts" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
              Browse Experts
            </a>
            <button className="w-full sm:w-auto px-8 py-4 glass hover:bg-slate-800/50 rounded-2xl font-bold text-lg transition-all active:scale-95 border border-slate-700/50">
              How it Works
            </button>
          </div>
        </motion.div>
      </section>

      {/* Expert Marketplace */}
      <section id="experts" className="py-24 px-6 border-t border-slate-800/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 md:mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-3 md:mb-4">Available Experts</h2>
              <p className="text-slate-400 text-base md:text-lg">Choose a creator and start a live conversation instantly.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Business', 'Health', 'Legal'].map((tag, i) => (
                <button key={tag} className={cn(
                  "px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-all",
                  i === 0 ? "bg-indigo-600 text-white" : "glass text-slate-400 hover:text-white"
                )}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CREATORS.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[2.5rem] p-6 group hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/50 flex flex-col"
              >
                <div className="w-full h-64 rounded-3xl overflow-hidden mb-6 relative">
                  <img src={creator.image} alt={creator.name} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-slate-700">
                      {creator.price}
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-2 mb-8">
                  <h3 className="text-2xl font-bold font-outfit text-white group-hover:text-indigo-400 transition-colors">
                    {creator.name}
                  </h3>
                  <p className="text-indigo-400 text-sm font-semibold tracking-wide uppercase">
                    {creator.title}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-4">
                    {creator.description}
                  </p>
                </div>

                <Link href={`/call/${creator.id}`} className="w-full">
                  <button className="w-full py-4 bg-white hover:bg-slate-200 text-slate-950 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 group/btn shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    <Phone size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    Call Now
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Brain, title: "Trained on Reality", desc: "Each AI clone is trained on the creator's actual books, podcasts, and tweets using RAG technology." },
              { icon: Zap, title: "Ultra Low Latency", desc: "Experience natural, interruption-friendly conversations powered by Gemini Flash Live." },
              { icon: Shield, title: "Private & Secure", desc: "Your 1-on-1 conversations are completely private and end-to-end encrypted." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold font-outfit">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

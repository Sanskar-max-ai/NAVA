"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  BarVisualizer,
  useLocalParticipant,
  DisconnectButton,
} from "@livekit/components-react";
import { Mic, MicOff, PhoneOff, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock database for frontend display
const CREATORS = {
  "narendra_modi": {
    name: "Narendra Modi",
    title: "Leadership & Vision",
    avatar: "NM",
    color: "from-orange-500 to-red-500",
  },
  "raj_shamani": {
    name: "Raj Shamani",
    title: "Business & Podcasting",
    avatar: "RS",
    color: "from-blue-500 to-indigo-500",
  },
  "ratan_tata": {
    name: "Ratan Tata",
    title: "Business Wisdom & Ethics",
    avatar: "RT",
    color: "from-slate-500 to-slate-700",
  }
};

export default function CallPage({ params }: { params: Promise<{ creatorId: string }> }) {
  const router = useRouter();
  const { creatorId } = use(params);
  const creator = CREATORS[creatorId as keyof typeof CREATORS];

  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!creator) {
      setError("Creator not found.");
      return;
    }

    const initCall = async () => {
      try {
        // Generate a unique room name that the Python agent can parse
        // Format: creator-{creatorId}-{randomString}
        const randomStr = Math.random().toString(36).substring(7);
        const roomName = `creator-${creatorId}-${randomStr}`;
        
        const resp = await fetch(`/api/token?room=${roomName}`);
        const data = await resp.json();
        
        if (data.error) throw new Error(data.error);
        
        setToken(data.token);
        setUrl(data.url);
      } catch (err: any) {
        console.error(err);
        setError("Failed to connect. Please try again.");
      }
    };

    initCall();
  }, [creatorId, creator]);

  const handleDisconnect = () => {
    router.push("/");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
        <p className="text-red-400">{error}</p>
        <button onClick={() => router.push("/")} className="text-indigo-400 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-950 text-slate-50">
      {/* Dynamic Background based on creator */}
      {creator && (
        <>
          <div className={cn("absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] -z-10 opacity-20 animate-pulse-slow bg-gradient-to-br", creator.color)} />
          <div className={cn("absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px] -z-10 opacity-20 animate-pulse-slow [animation-delay:2s] bg-gradient-to-br", creator.color)} />
        </>
      )}

      <div className="w-full max-w-4xl max-h-[800px] h-[80vh] glass rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-slate-700/50">
        {!token ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-slate-400 animate-pulse">Connecting to {creator?.name}...</p>
          </div>
        ) : (
          <LiveKitRoom
            video={false}
            audio={true}
            token={token}
            serverUrl={url!}
            onDisconnected={handleDisconnect}
            className="flex-1 flex flex-col relative"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
              <button 
                onClick={() => router.push("/")}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors group"
              >
                <ArrowLeft className="text-slate-400 group-hover:text-slate-200" size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-outfit font-semibold tracking-wide">Live Session</span>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                {creator?.avatar}
              </div>
            </div>

            {/* Main Visualizer Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md h-48 flex items-center justify-center"
              >
                <BarVisualizer className="h-32 w-full" />
              </motion.div>

              <div className="mt-12 text-center space-y-2">
                <h2 className="text-3xl font-outfit font-bold tracking-tight text-white">
                  {creator?.name}
                </h2>
                <p className="text-indigo-400 font-medium tracking-wide uppercase text-sm">
                  {creator?.title}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 sm:p-8 flex justify-center items-center gap-6 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-3 sm:gap-4 glass p-2 rounded-3xl border border-slate-700/50">
                <ControlToggle />
                <DisconnectButton className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all active:scale-95 group">
                  <PhoneOff size={24} className="sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
                </DisconnectButton>
              </div>
            </div>

            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </div>
    </main>
  );
}

import { Track } from "livekit-client";
import { TrackToggle } from "@livekit/components-react";

function ControlToggle() {
  return (
    <TrackToggle
      source={Track.Source.Microphone}
      id="mic-toggle-btn"
      className="relative flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl transition-all duration-300 active:scale-95 select-none bg-slate-800 hover:bg-slate-700 text-slate-200 data-[lk-enabled=false]:bg-red-500/15 data-[lk-enabled=false]:text-red-400 data-[lk-enabled=false]:border data-[lk-enabled=false]:border-red-500/30"
    >
      <Mic size={22} className="sm:w-6 sm:h-6 block group-data-[lk-enabled=false]:hidden" />
      <MicOff size={22} className="sm:w-6 sm:h-6 hidden group-data-[lk-enabled=false]:block" />
      <span className="text-sm sm:text-base font-semibold tracking-wide whitespace-nowrap">
        Mic
      </span>
    </TrackToggle>
  );
}

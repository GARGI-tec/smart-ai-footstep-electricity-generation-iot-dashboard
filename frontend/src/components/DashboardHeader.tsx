import { Zap } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="relative overflow-hidden border-b border-neon-amber/30">
      {/* Banner background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/assets/generated/dashboard-banner.dim_1200x200.png')" }}
      />
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

      <div className="relative z-10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-lg border border-neon-amber/50 bg-neon-amber/10 flex items-center justify-center glow-amber">
              <img
                src="/assets/generated/footstep-icon.dim_128x128.png"
                alt="Footstep"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-green animate-pulse-glow" />
          </div>
          <div>
            <h1 className="font-orbitron text-xl md:text-2xl font-bold text-neon-amber glow-text-amber tracking-wider uppercase">
              Smart AI Footstep Energy System
            </h1>
            <p className="text-xs text-muted-foreground font-mono-tech tracking-widest mt-0.5">
              IOT ENERGY MANAGEMENT DASHBOARD · LIVE MONITORING
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-neon-green/40 bg-neon-green/10">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
            <span className="text-xs font-mono-tech text-neon-green tracking-wider">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-neon-cyan/40 bg-neon-cyan/10">
            <Zap className="w-3 h-3 text-neon-cyan" />
            <span className="text-xs font-mono-tech text-neon-cyan tracking-wider">AI ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Wifi } from 'lucide-react';

export default function HardwareWaitingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />

      {/* Pulsing ring */}
      <div className="relative flex items-center justify-center mb-8">
        <span className="absolute inline-flex h-28 w-28 rounded-full bg-neon-amber opacity-10 animate-ping" />
        <span className="absolute inline-flex h-20 w-20 rounded-full bg-neon-amber opacity-15 animate-ping [animation-delay:0.3s]" />
        <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 border-neon-amber bg-background shadow-glow-amber">
          <Wifi className="w-7 h-7 text-neon-amber" />
        </div>
      </div>

      {/* Main message */}
      <h2 className="font-orbitron text-xl md:text-2xl text-neon-amber glow-amber tracking-widest uppercase text-center mb-3">
        Waiting for Hardware
      </h2>
      <p className="font-mono-tech text-sm md:text-base text-muted-foreground text-center max-w-sm px-4">
        Connect your IoT device and send sensor data to activate the dashboard.
      </p>

      {/* Animated dots */}
      <div className="flex gap-2 mt-6">
        <span className="w-2 h-2 rounded-full bg-neon-amber animate-pulse [animation-delay:0s]" />
        <span className="w-2 h-2 rounded-full bg-neon-amber animate-pulse [animation-delay:0.3s]" />
        <span className="w-2 h-2 rounded-full bg-neon-amber animate-pulse [animation-delay:0.6s]" />
      </div>

      {/* Status line */}
      <p className="font-mono-tech text-xs text-neon-cyan mt-8 tracking-widest uppercase opacity-70">
        [ SYSTEM ONLINE · AWAITING HARDWARE CONNECTION ]
      </p>
    </div>
  );
}

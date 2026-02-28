import { useGetRecords } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, ShieldCheck, ShieldOff, Clock } from 'lucide-react';
import type { EnergyRecord } from '../backend';

function getModeExplanation(mode: string, batteryLevel: number, footsteps: number): string {
  switch (mode) {
    case 'charging':
      return `Battery at ${batteryLevel}% — storing energy from footstep generator. ${footsteps} steps/min detected.`;
    case 'redirecting':
      return `Battery is ${batteryLevel}% full — overcharge protection active. Power redirected directly to lights and devices.`;
    case 'depleting':
      return `Low traffic detected (${footsteps} steps/min). Drawing from stored battery energy to power devices.`;
    default:
      return 'System initializing — waiting for first sensor tick...';
  }
}

function getModeLabel(mode: string): string {
  switch (mode) {
    case 'charging': return 'Charging Battery';
    case 'redirecting': return 'Redirecting to Devices';
    case 'depleting': return 'Using Stored Energy';
    default: return 'Initializing';
  }
}

function getModeColor(mode: string): string {
  switch (mode) {
    case 'charging': return 'text-neon-green';
    case 'redirecting': return 'text-neon-amber';
    case 'depleting': return 'text-neon-cyan';
    default: return 'text-muted-foreground';
  }
}

function getModeBarColor(mode: string): string {
  switch (mode) {
    case 'charging': return 'bg-neon-green';
    case 'redirecting': return 'bg-neon-amber';
    case 'depleting': return 'bg-neon-cyan';
    default: return 'bg-muted';
  }
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AIDecisionPanel() {
  const { data: records, isLoading } = useGetRecords();

  const latest: EnergyRecord | null = records && records.length > 0 ? records[records.length - 1] : null;
  const batteryLevel = latest ? Number(latest.batteryLevel) : 0;
  const footsteps = latest ? Number(latest.footsteps) : 0;
  const mode = latest ? latest.mode : 'initializing';
  const overchargeActive = batteryLevel >= 90;

  const recentRecords = records ? [...records].reverse().slice(0, 10) : [];

  return (
    <Card className="border bg-card card-glow-cyan">
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-neon-cyan" />
          AI Decision Engine
          {isLoading && (
            <span className="ml-auto text-xs font-mono-tech text-neon-cyan animate-pulse-glow">PROCESSING...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Decision */}
        <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getModeBarColor(mode)} animate-pulse-glow`} />
            <span className={`font-orbitron text-sm font-bold tracking-wider ${getModeColor(mode)}`}>
              {getModeLabel(mode).toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-foreground/80 font-mono-tech leading-relaxed">
            {getModeExplanation(mode, batteryLevel, footsteps)}
          </p>
        </div>

        {/* Overcharge Protection */}
        <div className={`rounded-lg border p-3 flex items-center gap-3 transition-all duration-500 ${
          overchargeActive
            ? 'border-neon-amber/50 bg-neon-amber/10 card-glow-amber'
            : 'border-border bg-muted/10'
        }`}>
          {overchargeActive ? (
            <ShieldCheck className="w-5 h-5 text-neon-amber flex-shrink-0" />
          ) : (
            <ShieldOff className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
          <div>
            <p className={`text-xs font-mono-tech font-semibold tracking-wider ${overchargeActive ? 'text-neon-amber' : 'text-muted-foreground'}`}>
              OVERCHARGE PROTECTION
            </p>
            <p className="text-xs text-muted-foreground font-mono-tech mt-0.5">
              {overchargeActive
                ? 'ACTIVE — Battery ≥90%, charging halted'
                : `STANDBY — Battery at ${batteryLevel}%`}
            </p>
          </div>
          <div className={`ml-auto w-2 h-2 rounded-full ${overchargeActive ? 'bg-neon-amber animate-pulse-glow' : 'bg-muted'}`} />
        </div>

        {/* Decision Log */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-mono-tech tracking-widest uppercase text-muted-foreground">
              Recent Decision Log
            </span>
          </div>
          <ScrollArea className="h-44 rounded-lg border border-border bg-background/50">
            <div className="p-2 space-y-1">
              {recentRecords.length === 0 ? (
                <p className="text-xs text-muted-foreground font-mono-tech p-2 text-center">
                  No records yet. Click "Advance Simulation" to start.
                </p>
              ) : (
                recentRecords.map((record, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/20 transition-colors"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getModeBarColor(record.mode)}`} />
                    <span className="text-xs font-mono-tech text-muted-foreground w-20 flex-shrink-0">
                      {formatTimestamp(record.timestamp)}
                    </span>
                    <span className={`text-xs font-mono-tech ${getModeColor(record.mode)}`}>
                      {getModeLabel(record.mode)}
                    </span>
                    <span className="text-xs font-mono-tech text-muted-foreground ml-auto">
                      {Number(record.batteryLevel)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

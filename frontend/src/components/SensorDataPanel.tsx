import { useGetRecords } from '../hooks/useQueries';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footprints, Zap, Battery, Cpu } from 'lucide-react';
import type { EnergyRecord } from '../backend';

function getModeConfig(mode: string) {
  switch (mode) {
    case 'charging':
      return {
        label: 'Charging Battery',
        color: 'text-neon-green',
        borderColor: 'card-glow-green',
        badgeClass: 'bg-neon-green/20 text-neon-green border-neon-green/40',
        glowClass: 'glow-green',
      };
    case 'redirecting':
      return {
        label: 'Redirecting to Devices',
        color: 'text-neon-amber',
        borderColor: 'card-glow-amber',
        badgeClass: 'bg-neon-amber/20 text-neon-amber border-neon-amber/40',
        glowClass: 'glow-amber',
      };
    case 'depleting':
      return {
        label: 'Using Stored Energy',
        color: 'text-neon-cyan',
        borderColor: 'card-glow-cyan',
        badgeClass: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40',
        glowClass: 'glow-cyan',
      };
    default:
      return {
        label: 'Initializing...',
        color: 'text-muted-foreground',
        borderColor: '',
        badgeClass: 'bg-muted/20 text-muted-foreground border-muted/40',
        glowClass: '',
      };
  }
}

function getBatteryColor(level: number) {
  if (level >= 80) return 'bg-neon-green';
  if (level >= 40) return 'bg-neon-amber';
  return 'bg-neon-red';
}

interface SensorCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accentClass: string;
}

function SensorCard({ icon, label, value, unit, accentClass }: SensorCardProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 flex flex-col gap-2 ${accentClass}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-mono-tech tracking-widest uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono-tech text-3xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground font-mono-tech">{unit}</span>
      </div>
    </div>
  );
}

export default function SensorDataPanel() {
  const { data: records, isLoading } = useGetRecords();

  const latest: EnergyRecord | null = records && records.length > 0 ? records[records.length - 1] : null;

  const footsteps = latest ? Number(latest.footsteps) : 0;
  const voltage = latest ? latest.voltage.toFixed(2) : '0.00';
  const batteryLevel = latest ? Number(latest.batteryLevel) : 0;
  const mode = latest ? latest.mode : 'initializing';
  const modeConfig = getModeConfig(mode);

  return (
    <Card className={`border bg-card ${modeConfig.borderColor}`}>
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Cpu className="w-4 h-4 text-neon-amber" />
          Live Sensor Data
          {isLoading && (
            <span className="ml-auto text-xs font-mono-tech text-neon-amber animate-pulse-glow">SYNCING...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <SensorCard
            icon={<Footprints className="w-4 h-4 text-neon-amber" />}
            label="Footsteps"
            value={footsteps.toString()}
            unit="steps/min"
            accentClass="card-glow-amber border"
          />
          <SensorCard
            icon={<Zap className="w-4 h-4 text-neon-cyan" />}
            label="Voltage"
            value={voltage}
            unit="W"
            accentClass="card-glow-cyan border"
          />
        </div>

        {/* Battery Level */}
        <div className="rounded-lg border card-glow-green bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Battery className="w-4 h-4 text-neon-green" />
              <span className="text-xs font-mono-tech tracking-widest uppercase">Battery Level</span>
            </div>
            <span className="font-mono-tech text-2xl font-bold text-neon-green glow-text-green">
              {batteryLevel}%
            </span>
          </div>
          <div className="relative h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getBatteryColor(batteryLevel)}`}
              style={{ width: `${batteryLevel}%` }}
            />
            <div className="absolute inset-0 scanline" />
          </div>
          <div className="flex justify-between text-xs font-mono-tech text-muted-foreground">
            <span>0%</span>
            <span className={batteryLevel >= 90 ? 'text-neon-amber' : ''}>
              {batteryLevel >= 90 ? '⚠ OVERCHARGE PROTECTION ACTIVE' : 'NORMAL RANGE'}
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* AI Mode Badge */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
          <span className="text-xs font-mono-tech tracking-widest uppercase text-muted-foreground">AI Mode</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono-tech font-semibold tracking-wider ${modeConfig.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${modeConfig.color.replace('text-', 'bg-')} animate-pulse-glow`} />
            {modeConfig.label.toUpperCase()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

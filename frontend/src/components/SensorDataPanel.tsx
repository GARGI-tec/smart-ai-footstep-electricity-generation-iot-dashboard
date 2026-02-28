import { useLatestReading } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footprints, Zap, Activity, Cpu, WifiOff } from 'lucide-react';

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
  const { data: reading, isLoading } = useLatestReading();

  const hasData = reading !== null && reading !== undefined;
  const voltage = hasData ? reading!.voltage.toFixed(2) : null;
  const current = hasData ? reading!.current.toFixed(3) : null;
  const energy = hasData ? reading!.energy.toFixed(3) : null;
  const footstepCount = hasData ? Number(reading!.footstepCount).toString() : null;

  return (
    <Card className={`border bg-card ${hasData ? 'card-glow-amber' : ''}`}>
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
        {!hasData && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <WifiOff className="w-8 h-8 text-muted-foreground/40" />
            <p className="font-orbitron text-xs tracking-widest uppercase text-muted-foreground">
              Awaiting Hardware Connection
            </p>
            <p className="text-xs font-mono-tech text-muted-foreground/60 text-center">
              Values will update automatically when ESP32 sends data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <SensorCard
              icon={<Footprints className="w-4 h-4 text-neon-amber" />}
              label="Footsteps"
              value={footstepCount ?? '—'}
              unit="steps"
              accentClass="card-glow-amber border"
            />
            <SensorCard
              icon={<Zap className="w-4 h-4 text-neon-cyan" />}
              label="Voltage"
              value={voltage ?? '—'}
              unit="V"
              accentClass="card-glow-cyan border"
            />
            <SensorCard
              icon={<Activity className="w-4 h-4 text-neon-green" />}
              label="Current"
              value={current ?? '—'}
              unit="A"
              accentClass="card-glow-green border"
            />
            <SensorCard
              icon={<Zap className="w-4 h-4 text-neon-amber" />}
              label="Energy"
              value={energy ?? '—'}
              unit="Wh"
              accentClass="card-glow-amber border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

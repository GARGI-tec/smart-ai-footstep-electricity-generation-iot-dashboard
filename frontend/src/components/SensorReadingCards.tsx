import { Zap, Activity, Footprints, Cpu, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLatestReading } from '../hooks/useQueries';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accentClass: string;
  iconColor: string;
}

function StatCard({ icon, label, value, unit, accentClass, iconColor }: StatCardProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 flex flex-col gap-2 ${accentClass}`}>
      <div className={`flex items-center gap-2 ${iconColor}`}>
        {icon}
        <span className="text-xs font-mono-tech tracking-widest uppercase text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-mono-tech text-3xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground font-mono-tech">{unit}</span>
      </div>
    </div>
  );
}

export default function SensorReadingCards() {
  const { data: reading, isLoading } = useLatestReading();

  const hasData = reading !== null && reading !== undefined;

  const voltage = hasData ? reading!.voltage.toFixed(2) : null;
  const current = hasData ? reading!.current.toFixed(3) : null;
  const energy = hasData ? reading!.energy.toFixed(3) : null;
  const footstepCount = hasData ? Number(reading!.footstepCount).toString() : null;

  return (
    <Card className={`border bg-card ${hasData ? 'card-glow-cyan' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neon-cyan" />
            ESP32 Live Sensor Readings
            {isLoading && (
              <span className="ml-2 text-xs font-mono-tech text-neon-cyan animate-pulse-glow">SYNCING...</span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <WifiOff className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground">
              No Device Connected
            </p>
            <p className="text-xs font-mono-tech text-muted-foreground/60 text-center max-w-xs">
              Connect your ESP32 hardware and start sending readings to see live sensor data here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={<Zap className="w-4 h-4" />}
              label="Voltage"
              value={voltage ?? '—'}
              unit="V"
              accentClass="card-glow-amber border"
              iconColor="text-neon-amber"
            />
            <StatCard
              icon={<Activity className="w-4 h-4" />}
              label="Current"
              value={current ?? '—'}
              unit="A"
              accentClass="card-glow-cyan border"
              iconColor="text-neon-cyan"
            />
            <StatCard
              icon={<Zap className="w-4 h-4" />}
              label="Energy"
              value={energy ?? '—'}
              unit="Wh"
              accentClass="card-glow-green border"
              iconColor="text-neon-green"
            />
            <StatCard
              icon={<Footprints className="w-4 h-4" />}
              label="Footsteps"
              value={footstepCount ?? '—'}
              unit="steps"
              accentClass="card-glow-amber border"
              iconColor="text-neon-amber"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

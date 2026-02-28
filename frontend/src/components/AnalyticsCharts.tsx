import { useLatestReading } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Zap, Activity, Footprints, WifiOff } from 'lucide-react';

interface MetricRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  barPercent: number;
  barColor: string;
}

function MetricRow({ icon, label, value, unit, barPercent, barColor }: MetricRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-xs font-mono-tech tracking-widest uppercase">{label}</span>
        </div>
        <span className="font-mono-tech text-sm font-bold text-foreground">
          {value}
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${barPercent}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsCharts() {
  const { data: reading, isLoading } = useLatestReading();

  const hasData = reading !== null && reading !== undefined;

  const voltage = hasData ? reading!.voltage : 0;
  const current = hasData ? reading!.current : 0;
  const energy = hasData ? reading!.energy : 0;
  const footstepCount = hasData ? Number(reading!.footstepCount) : 0;

  // Normalize values to percentages for bar display
  const voltagePercent = Math.min((voltage / 5.0) * 100, 100);
  const currentPercent = Math.min((current / 1.0) * 100, 100);
  const energyPercent = Math.min((energy / 10.0) * 100, 100);
  const footstepPercent = Math.min((footstepCount / 200) * 100, 100);

  return (
    <Card className={`border bg-card ${hasData ? 'card-glow-amber' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-neon-amber" />
          Sensor Analytics
          {isLoading && (
            <span className="ml-auto text-xs font-mono-tech text-neon-amber animate-pulse-glow">LOADING...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {!hasData && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <WifiOff className="w-8 h-8 text-muted-foreground/40" />
            <p className="font-orbitron text-xs tracking-widest uppercase text-muted-foreground">
              Awaiting Hardware Data
            </p>
            <p className="text-xs font-mono-tech text-muted-foreground/60 text-center">
              Analytics bars will fill as sensor readings arrive from your ESP32.
            </p>
          </div>
        ) : (
          <>
            <MetricRow
              icon={<Zap className="w-4 h-4 text-neon-amber" />}
              label="Voltage"
              value={voltage.toFixed(2)}
              unit="V"
              barPercent={voltagePercent}
              barColor="bg-neon-amber"
            />
            <MetricRow
              icon={<Activity className="w-4 h-4 text-neon-cyan" />}
              label="Current"
              value={current.toFixed(3)}
              unit="A"
              barPercent={currentPercent}
              barColor="bg-neon-cyan"
            />
            <MetricRow
              icon={<Zap className="w-4 h-4 text-neon-green" />}
              label="Energy"
              value={energy.toFixed(3)}
              unit="Wh"
              barPercent={energyPercent}
              barColor="bg-neon-green"
            />
            <MetricRow
              icon={<Footprints className="w-4 h-4 text-neon-amber" />}
              label="Footsteps"
              value={footstepCount.toString()}
              unit="steps"
              barPercent={footstepPercent}
              barColor="bg-neon-amber"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

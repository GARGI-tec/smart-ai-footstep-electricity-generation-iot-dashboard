import { BatteryCharging, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBatteryStatus } from '../hooks/useQueries';

export default function BatteryLevelPanel() {
  const { batteryLevel, hasData } = useBatteryStatus();

  const pct = hasData && batteryLevel !== null ? Math.min(100, Math.max(0, batteryLevel)) : null;

  const fillColor =
    pct === null
      ? 'bg-muted'
      : pct >= 60
      ? 'bg-neon-green'
      : pct >= 25
      ? 'bg-neon-amber'
      : 'bg-neon-red';

  const glowClass =
    pct === null
      ? ''
      : pct >= 60
      ? 'card-glow-green'
      : pct >= 25
      ? 'card-glow-amber'
      : 'border-neon-red/40';

  return (
    <Card className={`border bg-card ${glowClass}`}>
      <CardHeader className="pb-2">
        <CardTitle className="font-orbitron text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <BatteryCharging className="w-4 h-4 text-neon-amber" />
          Battery Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-4 gap-3">
            <WifiOff className="w-7 h-7 text-muted-foreground/40" />
            <p className="font-orbitron text-xs tracking-widest uppercase text-muted-foreground text-center">
              No Device Connected
            </p>
            <p className="text-xs font-mono-tech text-muted-foreground/60 text-center">
              Battery level will display once hardware is connected.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="font-mono-tech text-4xl font-bold text-foreground">{pct}</span>
              <span className="text-sm text-muted-foreground font-mono-tech">%</span>
            </div>

            {/* Battery bar */}
            <div className="relative h-4 rounded-sm bg-muted overflow-hidden border border-border">
              <div
                className={`h-full transition-all duration-700 ${fillColor}`}
                style={{ width: `${pct ?? 0}%` }}
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 scanline" />
            </div>

            {/* Battery icon segments */}
            <div className="flex items-center gap-1">
              {[0, 25, 50, 75].map((threshold) => (
                <div
                  key={threshold}
                  className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
                    pct !== null && pct > threshold
                      ? pct >= 60
                        ? 'bg-neon-green glow-green'
                        : pct >= 25
                        ? 'bg-neon-amber glow-amber'
                        : 'bg-neon-red'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

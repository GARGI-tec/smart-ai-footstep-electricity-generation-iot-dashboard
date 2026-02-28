import { useLatestReading } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Activity, Footprints, WifiOff } from 'lucide-react';

export default function AIDecisionPanel() {
  const { data: reading, isLoading } = useLatestReading();

  const hasData = reading !== null && reading !== undefined;
  const voltage = hasData ? reading!.voltage : 0;
  const current = hasData ? reading!.current : 0;
  const energy = hasData ? reading!.energy : 0;
  const footstepCount = hasData ? Number(reading!.footstepCount) : 0;

  // Derive a simple status from the reading values
  function getEnergyStatus(): { label: string; color: string; barColor: string; description: string } {
    if (!hasData) {
      return {
        label: 'AWAITING HARDWARE',
        color: 'text-muted-foreground',
        barColor: 'bg-muted',
        description: 'No sensor data received yet. Connect your ESP32 hardware to begin monitoring energy output.',
      };
    }
    if (voltage >= 4.0) {
      return {
        label: 'HIGH OUTPUT',
        color: 'text-neon-green',
        barColor: 'bg-neon-green',
        description: `Strong energy generation detected. Voltage at ${voltage.toFixed(2)}V with ${footstepCount} footsteps recorded.`,
      };
    }
    if (voltage >= 3.0) {
      return {
        label: 'NORMAL OUTPUT',
        color: 'text-neon-amber',
        barColor: 'bg-neon-amber',
        description: `Steady energy flow. Voltage at ${voltage.toFixed(2)}V, current ${current.toFixed(3)}A. Energy harvested: ${energy.toFixed(3)} Wh.`,
      };
    }
    return {
      label: 'LOW OUTPUT',
      color: 'text-neon-cyan',
      barColor: 'bg-neon-cyan',
      description: `Low voltage detected (${voltage.toFixed(2)}V). Check tile connections or increase foot traffic.`,
    };
  }

  const status = getEnergyStatus();

  return (
    <Card className={`border bg-card ${hasData ? 'card-glow-cyan' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-neon-cyan" />
          Energy Analysis
          {isLoading && (
            <span className="ml-auto text-xs font-mono-tech text-neon-cyan animate-pulse-glow">PROCESSING...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className={`rounded-lg border p-4 space-y-2 ${hasData ? 'border-neon-cyan/30 bg-neon-cyan/5' : 'border-border bg-muted/5'}`}>
          <div className="flex items-center gap-2">
            {hasData ? (
              <div className={`w-2 h-2 rounded-full ${status.barColor} animate-pulse-glow`} />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
            <span className={`font-orbitron text-sm font-bold tracking-wider ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-foreground/80 font-mono-tech leading-relaxed">
            {status.description}
          </p>
        </div>

        {/* Metrics Grid — only shown when data is available */}
        {hasData && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/10 p-3 text-center">
                <Zap className="w-4 h-4 text-neon-amber mx-auto mb-1" />
                <p className="font-mono-tech text-lg font-bold text-foreground">
                  {voltage.toFixed(2)}
                </p>
                <p className="text-xs font-mono-tech text-muted-foreground">Volts</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/10 p-3 text-center">
                <Activity className="w-4 h-4 text-neon-cyan mx-auto mb-1" />
                <p className="font-mono-tech text-lg font-bold text-foreground">
                  {current.toFixed(3)}
                </p>
                <p className="text-xs font-mono-tech text-muted-foreground">Amps</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/10 p-3 text-center">
                <Footprints className="w-4 h-4 text-neon-green mx-auto mb-1" />
                <p className="font-mono-tech text-lg font-bold text-foreground">
                  {footstepCount}
                </p>
                <p className="text-xs font-mono-tech text-muted-foreground">Steps</p>
              </div>
            </div>

            {/* Energy Harvested */}
            <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono-tech tracking-widest uppercase text-muted-foreground">Total Energy Harvested</p>
                <p className="font-mono-tech text-2xl font-bold text-neon-green glow-text-green mt-1">
                  {energy.toFixed(3)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">Wh</span>
                </p>
              </div>
              <Zap className="w-8 h-8 text-neon-green/40" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

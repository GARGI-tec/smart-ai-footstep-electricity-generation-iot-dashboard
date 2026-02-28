import { useLatestReading } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, WifiOff } from 'lucide-react';

export default function SimulationControl() {
  const { data: reading, isLoading } = useLatestReading();

  const hasData = reading !== null && reading !== undefined;

  return (
    <Card className={`border ${hasData ? 'border-neon-amber/30' : 'border-border'} bg-card`}>
      <CardContent className="py-3 px-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {hasData ? (
              <Activity className="w-4 h-4 text-neon-amber" />
            ) : (
              <WifiOff className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-xs font-mono-tech text-muted-foreground tracking-wider">ESP32 SENSOR STATUS</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isLoading
                    ? 'bg-neon-amber animate-pulse'
                    : hasData
                    ? 'bg-neon-green animate-pulse-glow'
                    : 'bg-muted-foreground'
                }`}
              />
              <span className="text-xs font-mono-tech text-muted-foreground">
                Status:{' '}
                <span
                  className={
                    isLoading
                      ? 'text-neon-amber'
                      : hasData
                      ? 'text-neon-green'
                      : 'text-muted-foreground'
                  }
                >
                  {isLoading ? 'SYNCING...' : hasData ? 'DATA RECEIVED' : 'NO DEVICE CONNECTED'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

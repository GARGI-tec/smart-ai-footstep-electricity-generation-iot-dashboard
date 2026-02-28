import { useAdvanceTime } from '../hooks/useQueries';
import { useGetRecords } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, RefreshCw, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function SimulationControl() {
  const { mutate: advanceTime, isPending } = useAdvanceTime();
  const { data: records } = useGetRecords();
  const [autoRun, setAutoRun] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (autoRun) {
      intervalRef.current = setInterval(() => {
        advanceTime();
      }, 4000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRun, advanceTime]);

  const recordCount = records?.length ?? 0;

  return (
    <Card className="border border-neon-amber/30 bg-card">
      <CardContent className="py-3 px-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-neon-amber" />
            <span className="text-xs font-mono-tech text-muted-foreground tracking-wider">SIMULATION CONTROL</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-mono-tech text-muted-foreground">
              Records: <span className="text-neon-amber">{recordCount}</span>
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => advanceTime()}
              disabled={isPending}
              className="h-7 px-3 text-xs font-mono-tech border-neon-amber/40 text-neon-amber hover:bg-neon-amber/10 hover:border-neon-amber/60"
            >
              {isPending ? (
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Play className="w-3 h-3 mr-1" />
              )}
              ADVANCE
            </Button>

            <Button
              size="sm"
              variant={autoRun ? 'default' : 'outline'}
              onClick={() => setAutoRun((v) => !v)}
              className={`h-7 px-3 text-xs font-mono-tech ${
                autoRun
                  ? 'bg-neon-green/20 border-neon-green/60 text-neon-green hover:bg-neon-green/30'
                  : 'border-neon-green/40 text-neon-green hover:bg-neon-green/10 hover:border-neon-green/60'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${autoRun ? 'bg-neon-green animate-pulse-glow' : 'bg-muted'}`} />
              {autoRun ? 'AUTO: ON' : 'AUTO: OFF'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

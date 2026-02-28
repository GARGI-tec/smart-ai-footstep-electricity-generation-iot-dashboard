import { Usb, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBatteryStatus } from '../hooks/useQueries';

export default function USBOutputStatusPanel() {
  const { usbOutputActive, hasData } = useBatteryStatus();

  const status = !hasData
    ? 'NO DEVICE'
    : usbOutputActive
    ? 'CHARGING'
    : 'IDLE';

  const statusColor =
    status === 'CHARGING'
      ? 'text-neon-green'
      : status === 'IDLE'
      ? 'text-neon-amber'
      : 'text-muted-foreground';

  const dotColor =
    status === 'CHARGING'
      ? 'bg-neon-green glow-green animate-pulse-glow'
      : status === 'IDLE'
      ? 'bg-neon-amber glow-amber'
      : 'bg-muted-foreground';

  const cardGlow =
    status === 'CHARGING'
      ? 'card-glow-green'
      : status === 'IDLE'
      ? 'card-glow-amber'
      : '';

  return (
    <Card className={`border bg-card ${cardGlow}`}>
      <CardHeader className="pb-2">
        <CardTitle className="font-orbitron text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <Usb className="w-4 h-4 text-neon-cyan" />
          USB Output Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-4 gap-3">
            <WifiOff className="w-7 h-7 text-muted-foreground/40" />
            <p className="font-orbitron text-xs tracking-widest uppercase text-muted-foreground text-center">
              Awaiting Hardware
            </p>
            <p className="text-xs font-mono-tech text-muted-foreground/60 text-center">
              USB output status will appear once your ESP32 is connected.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className={`inline-block w-3 h-3 rounded-full ${dotColor}`} />
              <span className={`font-mono-tech text-2xl font-bold tracking-widest ${statusColor}`}>
                {status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech text-muted-foreground">
              <div className="flex flex-col gap-1">
                <span className="uppercase tracking-wider">Output</span>
                <span className={`font-bold ${status === 'CHARGING' ? 'text-neon-green' : 'text-muted-foreground'}`}>
                  {status === 'CHARGING' ? '5V ACTIVE' : '—'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="uppercase tracking-wider">Device</span>
                <span className={`font-bold ${status === 'CHARGING' ? 'text-neon-green' : 'text-muted-foreground'}`}>
                  {status === 'CHARGING' ? 'CONNECTED' : '—'}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

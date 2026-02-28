import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLatestReading } from '../hooks/useQueries';
import { WifiOff } from 'lucide-react';

interface HexagonProps {
  active: boolean;
  label: string;
  stepCount: number | null;
}

function HexagonTile({ active, label, stepCount }: HexagonProps) {
  const hexPoints = '100,10 190,55 190,145 100,190 10,145 10,55';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 200 200"
        className={`w-32 h-32 md:w-40 md:h-40 transition-all duration-500 ${
          active ? 'drop-shadow-[0_0_16px_oklch(0.78_0.18_75/0.9)]' : ''
        }`}
      >
        {/* Outer hex border */}
        <polygon
          points={hexPoints}
          fill="none"
          stroke={active ? 'oklch(0.78 0.18 75)' : 'oklch(0.25 0 0)'}
          strokeWidth="3"
          className={active ? 'animate-pulse-glow' : ''}
        />

        {/* Inner hex fill */}
        <polygon
          points="100,30 175,72 175,128 100,170 25,128 25,72"
          fill={active ? 'oklch(0.78 0.18 75 / 0.15)' : 'oklch(0.14 0 0)'}
          stroke={active ? 'oklch(0.78 0.18 75 / 0.5)' : 'oklch(0.22 0 0)'}
          strokeWidth="1"
          className="transition-all duration-500"
        />

        {/* Grid lines inside hex */}
        <line x1="100" y1="30" x2="100" y2="170" stroke={active ? 'oklch(0.78 0.18 75 / 0.2)' : 'oklch(0.22 0 0 / 0.5)'} strokeWidth="1" />
        <line x1="25" y1="72" x2="175" y2="128" stroke={active ? 'oklch(0.78 0.18 75 / 0.2)' : 'oklch(0.22 0 0 / 0.5)'} strokeWidth="1" />
        <line x1="175" y1="72" x2="25" y2="128" stroke={active ? 'oklch(0.78 0.18 75 / 0.2)' : 'oklch(0.22 0 0 / 0.5)'} strokeWidth="1" />

        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill={active ? 'oklch(0.78 0.18 75)' : 'oklch(0.25 0 0)'}
          className={active ? 'animate-pulse-glow' : ''}
        />

        {/* Step count text or placeholder */}
        <text
          x="100"
          y="125"
          textAnchor="middle"
          fontFamily="'Share Tech Mono', monospace"
          fontSize="14"
          fill={active ? 'oklch(0.78 0.18 75)' : 'oklch(0.55 0 0)'}
        >
          {stepCount !== null ? `${stepCount} steps` : '— steps'}
        </text>
      </svg>

      <div className="text-center">
        <span
          className={`font-mono-tech text-xs tracking-widest uppercase ${
            active ? 'text-neon-amber glow-text-amber' : 'text-muted-foreground'
          }`}
        >
          {label}
        </span>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              active ? 'bg-neon-amber glow-amber animate-pulse-glow' : 'bg-muted'
            }`}
          />
          <span className={`font-mono-tech text-xs ${active ? 'text-neon-amber' : 'text-muted-foreground'}`}>
            {active ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HexagonTilePanel() {
  const { data: reading } = useLatestReading();
  const hasData = reading !== null && reading !== undefined;
  const totalSteps = hasData ? Number(reading!.footstepCount) : null;
  const isActive = totalSteps !== null && totalSteps > 0;

  // Distribute steps roughly evenly between 2 tiles
  const tile1Steps = totalSteps !== null ? Math.ceil(totalSteps / 2) : null;
  const tile2Steps = totalSteps !== null ? Math.floor(totalSteps / 2) : null;

  return (
    <Card className={`border bg-card transition-all duration-500 ${isActive ? 'card-glow-amber' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-neon-amber fill-none stroke-current" strokeWidth="2">
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
          </svg>
          Hexagon Tile Layout
          {isActive && (
            <span className="ml-2 text-xs font-mono-tech text-neon-amber animate-pulse-glow">● ENERGY DETECTED</span>
          )}
        </CardTitle>
        <p className="text-xs font-mono-tech text-muted-foreground mt-1">
          2 tiles · College Campus Steps · Step 1 &amp; Step 2
        </p>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <WifiOff className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground">
              Awaiting Hardware
            </p>
            <p className="text-xs font-mono-tech text-muted-foreground/60 text-center max-w-xs">
              Tiles will activate and display footstep data once your ESP32 hardware is connected.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 py-4">
              <HexagonTile active={isActive} label="Tile 1 — Step 1" stepCount={tile1Steps} />

              {/* Connector line */}
              <div className="flex sm:flex-col items-center gap-1">
                <div className={`w-8 h-px sm:w-px sm:h-8 ${isActive ? 'bg-neon-amber' : 'bg-border'} transition-colors duration-500`} />
                <div className={`font-mono-tech text-xs ${isActive ? 'text-neon-amber' : 'text-muted-foreground'}`}>
                  {isActive ? '⚡' : '—'}
                </div>
                <div className={`w-8 h-px sm:w-px sm:h-8 ${isActive ? 'bg-neon-amber' : 'bg-border'} transition-colors duration-500`} />
              </div>

              <HexagonTile active={isActive} label="Tile 2 — Step 2" stepCount={tile2Steps} />
            </div>

            {/* Total energy summary bar */}
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-mono-tech text-xs text-muted-foreground uppercase tracking-wider">Total Steps</p>
                <p className={`font-mono-tech text-xl font-bold ${isActive ? 'text-neon-amber' : 'text-foreground'}`}>
                  {totalSteps ?? '—'}
                </p>
              </div>
              <div>
                <p className="font-mono-tech text-xs text-muted-foreground uppercase tracking-wider">Tiles Active</p>
                <p className={`font-mono-tech text-xl font-bold ${isActive ? 'text-neon-green' : 'text-foreground'}`}>
                  {isActive ? '2 / 2' : '0 / 2'}
                </p>
              </div>
              <div>
                <p className="font-mono-tech text-xs text-muted-foreground uppercase tracking-wider">Energy</p>
                <p className={`font-mono-tech text-xl font-bold ${isActive ? 'text-neon-cyan' : 'text-foreground'}`}>
                  {hasData ? reading!.energy.toFixed(3) : '—'} <span className="text-xs">Wh</span>
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

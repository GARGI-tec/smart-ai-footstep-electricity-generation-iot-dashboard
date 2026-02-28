import { useLatestReading } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

type FlowMode = 'high' | 'normal' | 'low' | 'idle';

function getFlowMode(voltage: number, hasData: boolean): FlowMode {
  if (!hasData) return 'idle';
  if (voltage >= 4.0) return 'high';
  if (voltage >= 3.0) return 'normal';
  return 'low';
}

function getActiveEdges(mode: FlowMode): Set<string> {
  switch (mode) {
    case 'high':
      return new Set(['footstep-generator', 'generator-battery', 'generator-devices']);
    case 'normal':
      return new Set(['footstep-generator', 'generator-battery']);
    case 'low':
      return new Set(['battery-devices']);
    default:
      return new Set();
  }
}

function getEdgeColor(edgeId: string, activeEdges: Set<string>): string {
  if (!activeEdges.has(edgeId)) return '#2a2a2a';
  if (edgeId.includes('battery-devices')) return '#72c8e0';
  if (edgeId.includes('generator-devices')) return '#f0b429';
  return '#72e0a0';
}

interface FlowNodeProps {
  x: number;
  y: number;
  label: string;
  sublabel: string;
  icon: string;
  isActive: boolean;
  color: string;
}

function FlowNode({ x, y, label, sublabel, icon, isActive, color }: FlowNodeProps) {
  return (
    <g transform={`translate(${x}, ${y})`} style={{ opacity: isActive ? 1 : 0.35 }}>
      <rect
        x="-45"
        y="-30"
        width="90"
        height="60"
        rx="8"
        fill="#141414"
        stroke={isActive ? color : '#2a2a2a'}
        strokeWidth={isActive ? 1.5 : 1}
        filter={isActive ? `drop-shadow(0 0 6px ${color}80)` : undefined}
      />
      <text x="0" y="-8" textAnchor="middle" fontSize="18" fill={isActive ? color : '#555'}>
        {icon}
      </text>
      <text x="0" y="8" textAnchor="middle" fontSize="9" fontFamily="'Share Tech Mono', monospace" fill={isActive ? '#e0e0e0' : '#555'} fontWeight="600">
        {label}
      </text>
      <text x="0" y="20" textAnchor="middle" fontSize="7" fontFamily="'Share Tech Mono', monospace" fill={isActive ? color : '#444'}>
        {sublabel}
      </text>
    </g>
  );
}

interface FlowArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  edgeId: string;
  activeEdges: Set<string>;
  label?: string;
}

function FlowArrow({ x1, y1, x2, y2, edgeId, activeEdges, label }: FlowArrowProps) {
  const isActive = activeEdges.has(edgeId);
  const color = getEdgeColor(edgeId, activeEdges);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      <defs>
        <marker
          id={`arrow-${edgeId}`}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={isActive ? 2 : 1}
        strokeDasharray={isActive ? '6 3' : '4 4'}
        markerEnd={`url(#arrow-${edgeId})`}
        style={isActive ? { animation: 'flow 1.5s linear infinite' } : undefined}
      />
      {label && isActive && (
        <text
          x={midX}
          y={midY - 6}
          textAnchor="middle"
          fontSize="7"
          fontFamily="'Share Tech Mono', monospace"
          fill={color}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function EnergyFlowDiagram() {
  const { data: reading } = useLatestReading();

  const hasData = reading !== null && reading !== undefined;
  const voltage = hasData ? reading!.voltage : 0;
  const mode = getFlowMode(voltage, hasData);
  const activeEdges = getActiveEdges(mode);

  const nodeActive = (nodeId: string) => {
    return (
      (nodeId === 'footstep' && activeEdges.has('footstep-generator')) ||
      (nodeId === 'generator' && (activeEdges.has('footstep-generator') || activeEdges.has('generator-battery') || activeEdges.has('generator-devices'))) ||
      (nodeId === 'battery' && (activeEdges.has('generator-battery') || activeEdges.has('battery-devices'))) ||
      (nodeId === 'devices' && (activeEdges.has('generator-devices') || activeEdges.has('battery-devices')))
    );
  };

  return (
    <Card className="border bg-card card-glow-green">
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-neon-green" />
          Energy Flow Diagram
          {hasData && (
            <span className="ml-auto text-xs font-mono-tech text-neon-green animate-pulse-glow">● LIVE</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            viewBox="0 0 500 160"
            className="w-full"
            style={{ minHeight: '120px' }}
          >
            {/* Arrows */}
            <FlowArrow x1={110} y1={80} x2={175} y2={80} edgeId="footstep-generator" activeEdges={activeEdges} label="kinetic" />
            <FlowArrow x1={265} y1={65} x2={310} y2={45} edgeId="generator-battery" activeEdges={activeEdges} label="charge" />
            <FlowArrow x1={265} y1={95} x2={310} y2={115} edgeId="generator-devices" activeEdges={activeEdges} label="direct" />
            <FlowArrow x1={400} y1={45} x2={430} y2={80} edgeId="battery-devices" activeEdges={activeEdges} label="stored" />

            {/* Nodes */}
            <FlowNode x={65} y={80} label="FOOTSTEPS" sublabel="piezo tiles" icon="👟" isActive={nodeActive('footstep')} color="#72e0a0" />
            <FlowNode x={220} y={80} label="GENERATOR" sublabel="piezo array" icon="⚡" isActive={nodeActive('generator')} color="#72e0a0" />
            <FlowNode x={355} y={35} label="BATTERY" sublabel="storage" icon="🔋" isActive={nodeActive('battery')} color="#72c8e0" />
            <FlowNode x={460} y={100} label="DEVICES" sublabel="USB output" icon="📱" isActive={nodeActive('devices')} color="#f0b429" />
          </svg>

          {/* No device overlay */}
          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
                <p className="font-mono-tech text-xs text-muted-foreground tracking-widest uppercase text-center">
                  No Device Connected
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono-tech text-muted-foreground border-t border-border pt-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-neon-green" />
            <span>Kinetic → Electric</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-neon-cyan" />
            <span>Battery Discharge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-neon-amber" />
            <span>Direct Output</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

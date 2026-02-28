import { useGetRecords } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';
import type { EnergyRecord } from '../backend';

type FlowMode = 'charging' | 'redirecting' | 'depleting' | 'initializing';

function getActiveEdges(mode: FlowMode): Set<string> {
  switch (mode) {
    case 'charging':
      return new Set(['footstep-generator', 'generator-battery']);
    case 'redirecting':
      return new Set(['footstep-generator', 'generator-devices']);
    case 'depleting':
      return new Set(['battery-devices']);
    default:
      return new Set();
  }
}

function getEdgeColor(edgeId: string, activeEdges: Set<string>): string {
  if (!activeEdges.has(edgeId)) return '#2a2a2a';
  if (edgeId.includes('battery')) return '#72c8e0'; // cyan
  if (edgeId.includes('generator-devices')) return '#f0b429'; // amber
  return '#72e0a0'; // green
}

function getNodeGlow(nodeId: string, activeEdges: Set<string>): string {
  const isActive =
    (nodeId === 'footstep' && (activeEdges.has('footstep-generator'))) ||
    (nodeId === 'generator' && (activeEdges.has('footstep-generator') || activeEdges.has('generator-battery') || activeEdges.has('generator-devices'))) ||
    (nodeId === 'battery' && (activeEdges.has('generator-battery') || activeEdges.has('battery-devices'))) ||
    (nodeId === 'devices' && (activeEdges.has('generator-devices') || activeEdges.has('battery-devices')));

  if (!isActive) return 'opacity-40';
  return 'opacity-100';
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
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={isActive ? 2.5 : 1}
        strokeDasharray={isActive ? '8 4' : '4 4'}
        markerEnd={`url(#arrow-${edgeId})`}
        opacity={isActive ? 1 : 0.3}
        style={isActive ? {
          animation: 'flow-dash 1.2s linear infinite',
          strokeDashoffset: 0,
        } : undefined}
      />
      {label && isActive && (
        <text
          x={midX}
          y={midY - 8}
          textAnchor="middle"
          fontSize="7"
          fontFamily="'Share Tech Mono', monospace"
          fill={color}
          opacity={0.9}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function EnergyFlowDiagram() {
  const { data: records } = useGetRecords();
  const latest: EnergyRecord | null = records && records.length > 0 ? records[records.length - 1] : null;
  const mode = (latest?.mode ?? 'initializing') as FlowMode;
  const activeEdges = getActiveEdges(mode);

  const nodes = {
    footstep: { x: 80, y: 100 },
    generator: { x: 220, y: 100 },
    battery: { x: 360, y: 100 },
    devices: { x: 500, y: 100 },
  };

  const isNodeActive = (nodeId: string) =>
    (nodeId === 'footstep' && activeEdges.has('footstep-generator')) ||
    (nodeId === 'generator' && (activeEdges.has('footstep-generator') || activeEdges.has('generator-battery') || activeEdges.has('generator-devices'))) ||
    (nodeId === 'battery' && (activeEdges.has('generator-battery') || activeEdges.has('battery-devices'))) ||
    (nodeId === 'devices' && (activeEdges.has('generator-devices') || activeEdges.has('battery-devices')));

  const getNodeColor = (nodeId: string) => {
    if (!isNodeActive(nodeId)) return '#2a2a2a';
    if (nodeId === 'footstep' || nodeId === 'generator') {
      if (mode === 'charging') return '#72e0a0';
      if (mode === 'redirecting') return '#f0b429';
      return '#72c8e0';
    }
    if (nodeId === 'battery') return mode === 'depleting' ? '#72c8e0' : '#72e0a0';
    return mode === 'redirecting' ? '#f0b429' : '#72c8e0';
  };

  return (
    <Card className="border bg-card card-glow-amber">
      <CardHeader className="pb-2">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-neon-amber" />
          Energy Flow Diagram
          <span className="ml-auto text-xs font-mono-tech text-neon-amber">
            {mode === 'charging' && '⚡ CHARGING MODE'}
            {mode === 'redirecting' && '→ REDIRECT MODE'}
            {mode === 'depleting' && '🔋 STORED ENERGY MODE'}
            {mode === 'initializing' && '◌ STANDBY'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 580 200"
            className="w-full"
            style={{ minWidth: '320px', maxHeight: '200px' }}
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="580" height="200" fill="url(#grid)" />

            {/* Arrows */}
            <FlowArrow
              x1={nodes.footstep.x + 45}
              y1={nodes.footstep.y}
              x2={nodes.generator.x - 45}
              y2={nodes.generator.y}
              edgeId="footstep-generator"
              activeEdges={activeEdges}
              label="KINETIC"
            />
            <FlowArrow
              x1={nodes.generator.x + 45}
              y1={nodes.generator.y}
              x2={nodes.battery.x - 45}
              y2={nodes.battery.y}
              edgeId="generator-battery"
              activeEdges={activeEdges}
              label="STORE"
            />
            {/* Diagonal arrow: generator → devices (bypass battery) */}
            <FlowArrow
              x1={nodes.generator.x + 40}
              y1={nodes.generator.y - 15}
              x2={nodes.devices.x - 40}
              y2={nodes.devices.y - 15}
              edgeId="generator-devices"
              activeEdges={activeEdges}
              label="DIRECT"
            />
            <FlowArrow
              x1={nodes.battery.x + 45}
              y1={nodes.battery.y}
              x2={nodes.devices.x - 45}
              y2={nodes.devices.y}
              edgeId="battery-devices"
              activeEdges={activeEdges}
              label="SUPPLY"
            />

            {/* Nodes */}
            <FlowNode
              x={nodes.footstep.x}
              y={nodes.footstep.y}
              label="FOOTSTEPS"
              sublabel="SENSOR"
              icon="👣"
              isActive={isNodeActive('footstep')}
              color={getNodeColor('footstep')}
            />
            <FlowNode
              x={nodes.generator.x}
              y={nodes.generator.y}
              label="GENERATOR"
              sublabel="PIEZO"
              icon="⚡"
              isActive={isNodeActive('generator')}
              color={getNodeColor('generator')}
            />
            <FlowNode
              x={nodes.battery.x}
              y={nodes.battery.y}
              label="BATTERY"
              sublabel="STORAGE"
              icon="🔋"
              isActive={isNodeActive('battery')}
              color={getNodeColor('battery')}
            />
            <FlowNode
              x={nodes.devices.x}
              y={nodes.devices.y}
              label="DEVICES"
              sublabel="LIGHTS/IoT"
              icon="💡"
              isActive={isNodeActive('devices')}
              color={getNodeColor('devices')}
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-neon-green" />
            <span className="text-xs font-mono-tech text-muted-foreground">Charging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-neon-amber" />
            <span className="text-xs font-mono-tech text-muted-foreground">Redirecting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-neon-cyan" />
            <span className="text-xs font-mono-tech text-muted-foreground">Stored Energy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-muted" />
            <span className="text-xs font-mono-tech text-muted-foreground">Inactive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useGetRecords, useHourlyFootsteps } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import type { EnergyRecord } from '../backend';

function formatTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

const CHART_STYLE = {
  background: 'transparent',
  fontSize: 10,
  fontFamily: "'Share Tech Mono', monospace",
};

const TOOLTIP_STYLE = {
  backgroundColor: '#141414',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  fontSize: '11px',
  fontFamily: "'Share Tech Mono', monospace",
  color: '#e0e0e0',
};

export default function AnalyticsCharts() {
  const { data: records } = useGetRecords();
  const { data: hourlyData } = useHourlyFootsteps();

  const timeSeriesData = (records ?? []).map((r: EnergyRecord) => ({
    time: formatTime(r.timestamp),
    voltage: parseFloat(r.voltage.toFixed(2)),
    battery: Number(r.batteryLevel),
    footsteps: Number(r.footsteps),
  }));

  const hourlyChartData = (hourlyData ?? []).map((d) => ({
    hour: `${d.hour.toString().padStart(2, '0')}:00`,
    footsteps: d.footsteps,
    period: d.hour >= 6 && d.hour < 12 ? 'morning' : d.hour >= 12 && d.hour < 18 ? 'afternoon' : 'night',
  }));

  return (
    <Card className="border bg-card card-glow-amber">
      <CardHeader className="pb-3">
        <CardTitle className="font-orbitron text-sm tracking-widest uppercase text-muted-foreground flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-neon-amber" />
          Analytics & Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="footsteps">
          <TabsList className="bg-muted/30 border border-border mb-4 h-8">
            <TabsTrigger value="footsteps" className="text-xs font-mono-tech tracking-wider data-[state=active]:bg-neon-amber/20 data-[state=active]:text-neon-amber">
              FOOTSTEPS/HR
            </TabsTrigger>
            <TabsTrigger value="voltage" className="text-xs font-mono-tech tracking-wider data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              VOLTAGE
            </TabsTrigger>
            <TabsTrigger value="battery" className="text-xs font-mono-tech tracking-wider data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green">
              BATTERY
            </TabsTrigger>
          </TabsList>

          {/* Hourly Footsteps Bar Chart */}
          <TabsContent value="footsteps">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-neon-amber" />
                <span className="text-xs font-mono-tech text-muted-foreground">Morning (High)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-neon-cyan" />
                <span className="text-xs font-mono-tech text-muted-foreground">Afternoon (Low)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-muted" />
                <span className="text-xs font-mono-tech text-muted-foreground">Night</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyChartData} style={CHART_STYLE} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#666', fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2a2a2a' }}
                  interval={3}
                />
                <YAxis
                  tick={{ fill: '#666', fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2a2a2a' }}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={{ color: '#999' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar
                  dataKey="footsteps"
                  name="Steps/min"
                  radius={[2, 2, 0, 0]}
                  fill="oklch(0.78 0.18 75)"
                  // Color by period
                  label={false}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs font-mono-tech text-muted-foreground text-center mt-1">
              Hourly footstep pattern — morning peak clearly visible (06:00–12:00)
            </p>
          </TabsContent>

          {/* Voltage Line Chart */}
          <TabsContent value="voltage">
            {timeSeriesData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground font-mono-tech text-sm">
                No data yet — advance simulation to generate records
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={timeSeriesData} style={CHART_STYLE} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#666', fontSize: 9 }}
                    tickLine={false}
                    axisLine={{ stroke: '#2a2a2a' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#666', fontSize: 9 }}
                    tickLine={false}
                    axisLine={{ stroke: '#2a2a2a' }}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={{ color: '#999' }}
                    cursor={{ stroke: 'oklch(0.72 0.18 200 / 0.3)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    name="Voltage (W)"
                    stroke="oklch(0.72 0.18 200)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'oklch(0.72 0.18 200)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          {/* Battery Level Line Chart */}
          <TabsContent value="battery">
            {timeSeriesData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground font-mono-tech text-sm">
                No data yet — advance simulation to generate records
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={timeSeriesData} style={CHART_STYLE} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#666', fontSize: 9 }}
                    tickLine={false}
                    axisLine={{ stroke: '#2a2a2a' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#666', fontSize: 9 }}
                    tickLine={false}
                    axisLine={{ stroke: '#2a2a2a' }}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={{ color: '#999' }}
                    cursor={{ stroke: 'oklch(0.72 0.2 145 / 0.3)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="battery"
                    name="Battery (%)"
                    stroke="oklch(0.72 0.2 145)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: 'oklch(0.72 0.2 145)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

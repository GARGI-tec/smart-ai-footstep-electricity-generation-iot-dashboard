import DashboardHeader from './DashboardHeader';
import SensorDataPanel from './SensorDataPanel';
import AIDecisionPanel from './AIDecisionPanel';
import EnergyFlowDiagram from './EnergyFlowDiagram';
import AnalyticsCharts from './AnalyticsCharts';
import SimulationControl from './SimulationControl';
import SensorReadingCards from './SensorReadingCards';
import HexagonTilePanel from './HexagonTilePanel';
import BatteryLevelPanel from './BatteryLevelPanel';
import USBOutputStatusPanel from './USBOutputStatusPanel';
import { Heart } from 'lucide-react';

export default function DashboardLayout() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown-app';
  const utmContent = encodeURIComponent(hostname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="flex-1 p-4 md:p-6 space-y-4 max-w-[1400px] mx-auto w-full">
        {/* Simulation Control Bar */}
        <SimulationControl />

        {/* ESP32 Live Sensor Reading Cards */}
        <SensorReadingCards />

        {/* Hexagon Tile Visualization */}
        <HexagonTilePanel />

        {/* Battery & USB Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BatteryLevelPanel />
          <USBOutputStatusPanel />
        </div>

        {/* Top Row: Sensor Data + AI Decision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SensorDataPanel />
          <AIDecisionPanel />
        </div>

        {/* Middle Row: Energy Flow Diagram */}
        <EnergyFlowDiagram />

        {/* Bottom Row: Analytics Charts */}
        <AnalyticsCharts />
      </main>

      <footer className="border-t border-border py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-mono-tech text-muted-foreground">
            © {new Date().getFullYear()} Smart AI Footstep Energy System · Final Year Engineering Project
          </p>
          <p className="text-xs font-mono-tech text-muted-foreground flex items-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 text-neon-amber fill-neon-amber" />
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${utmContent}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-amber hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

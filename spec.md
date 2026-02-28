# Specification

## Summary
**Goal:** Replace fake/demo sensor data with a clear "No Device Connected" state across the entire dashboard when no real ESP32 hardware reading is available.

**Planned changes:**
- Update `SimulationControl` component to show a visually distinct "No Device Connected" indicator (grey/muted) when no real sensor reading has been received
- Remove all hardcoded/simulated mock sensor values from `useQueries.ts`; return null/undefined for all sensor fields when no backend reading exists
- Update all dashboard panel components (`SensorDataPanel`, `SensorReadingCards`, `AnalyticsCharts`, `BatteryLevelPanel`, `USBOutputStatusPanel`, `AIDecisionPanel`, `EnergyFlowDiagram`, `HexagonTilePanel`) to display a "No Device Connected" or "Awaiting Hardware" placeholder instead of zeroed-out or default values when data is null
- Ensure all panels automatically switch to displaying real readings once hardware connects and data arrives

**User-visible outcome:** The dashboard no longer shows misleading fake or zeroed data; instead, every panel clearly indicates that no hardware is connected until a real ESP32 reading is received.

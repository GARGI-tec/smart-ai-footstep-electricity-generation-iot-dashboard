# Specification

## Summary
**Goal:** Show a blank waiting state on the dashboard until real hardware connects and sends sensor data.

**Planned changes:**
- Add an `isHardwareConnected` boolean flag to the backend state, defaulting to `false`
- Set the flag to `true` when real sensor data is received via the hardware POST API endpoint
- Expose an `isHardwareConnected` query function on the backend
- Update the frontend dashboard to hide all panels (SensorDataPanel, AIDecisionPanel, EnergyFlowDiagram, AnalyticsCharts, SimulationControl) when `isHardwareConnected` is `false`
- Display a centered "Waiting for hardware connection..." placeholder with a pulsing animation styled to match the existing dark neon industrial theme
- Poll `isHardwareConnected` every 3 seconds via React Query and automatically reveal all panels when the flag becomes `true`

**User-visible outcome:** The dashboard shows a blank waiting screen with a pulsing "Waiting for hardware connection..." message until real hardware POSTs sensor data, at which point all panels automatically appear with live data — no page refresh required.

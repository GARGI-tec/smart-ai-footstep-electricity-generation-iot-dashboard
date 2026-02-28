# Specification

## Summary
**Goal:** Build a Smart AI Footstep Electricity Generation IoT Dashboard with a simulated backend, AI energy management logic, real-time frontend panels, animated energy flow, and analytics charts — styled as a dark industrial control room.

**Planned changes:**
- Backend actor stores and manages simulated IoT state: footstep count, voltage (W), battery level (0–100%), current AI mode, and timestamped historical records
- Backend simulates time-of-day traffic patterns: high footsteps/voltage in morning (6am–12pm), lower in afternoon (12pm–6pm), minimal at night
- AI energy management logic: "Charging Battery" (20–90%), "Redirecting to Devices" (≥90%), "Using Stored Energy" (<20% + low traffic); recalculated each tick
- Auto-tick endpoint advances simulated time and updates readings every few seconds
- Frontend live sensor panel: footstep count (steps/min), voltage (W), battery progress bar with color thresholds, color-coded AI mode badge (green/amber/blue)
- Frontend AI decision panel: human-readable explanation of current mode, overcharge protection indicator, log of last 10 AI decisions with timestamps
- Frontend animated energy flow diagram: nodes (Footsteps → Generator → Battery → Devices/Lights) with glowing/animated active path based on AI mode
- Frontend analytics section: bar chart for hourly footstep counts, line chart for energy generated over time, line chart for battery level trend; all update with new data
- Dark industrial/tech theme: dark background, neon amber/green/cyan accents, glowing card borders, large data-readout typography, header displaying "Smart AI Footstep Energy System"

**User-visible outcome:** Users can view a live-updating control room dashboard showing simulated footstep energy generation, AI-managed battery decisions, an animated power flow diagram, and historical analytics charts — all auto-refreshing every few seconds.

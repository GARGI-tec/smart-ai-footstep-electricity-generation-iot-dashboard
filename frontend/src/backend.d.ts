import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EnergyRecord {
    voltage: number;
    batteryLevel: bigint;
    mode: string;
    timestamp: Time;
    footsteps: bigint;
}
export type Time = bigint;
export interface backendInterface {
    adjustEnergyMode(): Promise<void>;
    advanceTime(): Promise<void>;
    getCurrentHour(): Promise<bigint>;
    getFootstepsByHour(hour: bigint): Promise<bigint>;
    getFootstepsToday(): Promise<bigint>;
    getRecords(): Promise<Array<EnergyRecord>>;
    isHardwareConnected(): Promise<boolean>;
}

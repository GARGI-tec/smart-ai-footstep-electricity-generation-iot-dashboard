import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BatteryStatus {
    status: string;
    percentage: bigint;
}
export interface Reading {
    voltage: number;
    footstepCount: bigint;
    usbOutputActive: boolean;
    batteryLevel: bigint;
    current: number;
    energy: number;
}
export interface backendInterface {
    getBatteryStatus(): Promise<BatteryStatus>;
    getLatestReading(): Promise<Reading | null>;
    submitReading(reading: Reading): Promise<void>;
}

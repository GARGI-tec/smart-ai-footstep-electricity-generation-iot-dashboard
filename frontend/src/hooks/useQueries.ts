import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EnergyRecord } from '../backend';

export function useGetRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<EnergyRecord[]>({
    queryKey: ['records'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecords();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 4000,
  });
}

export function useGetCurrentHour() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['currentHour'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCurrentHour();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 4000,
  });
}

export function useGetFootstepsByHour(hour: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['footstepsByHour', hour.toString()],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getFootstepsByHour(hour);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFootstepsToday() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['footstepsToday'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getFootstepsToday();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 4000,
  });
}

export function useAdvanceTime() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.advanceTime();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['currentHour'] });
      queryClient.invalidateQueries({ queryKey: ['footstepsToday'] });
    },
  });
}

export function useAdjustEnergyMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.adjustEnergyMode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}

export function useHourlyFootsteps() {
  const { actor, isFetching } = useActor();
  return useQuery<{ hour: number; footsteps: number }[]>({
    queryKey: ['hourlyFootsteps'],
    queryFn: async () => {
      if (!actor) return [];
      const results = await Promise.all(
        Array.from({ length: 24 }, (_, i) =>
          actor.getFootstepsByHour(BigInt(i)).then((v) => ({ hour: i, footsteps: Number(v) }))
        )
      );
      return results;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useHardwareConnectionStatus() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['hardwareConnected'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isHardwareConnected();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

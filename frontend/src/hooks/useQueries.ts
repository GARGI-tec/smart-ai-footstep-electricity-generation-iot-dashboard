import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reading } from '../backend';

export function useLatestReading() {
  const { actor, isFetching } = useActor();
  return useQuery<Reading | null>({
    queryKey: ['latestReading'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestReading();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 4000,
  });
}

export function useSubmitReading() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reading: Reading) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.submitReading(reading);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestReading'] });
    },
  });
}

export function useBatteryStatus() {
  const { data: reading } = useLatestReading();
  const hasData = reading !== null && reading !== undefined;
  return {
    batteryLevel: hasData ? Number(reading!.batteryLevel) : null,
    usbOutputActive: hasData ? reading!.usbOutputActive : null,
    hasData,
  };
}

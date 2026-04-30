import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/config/api';
import { QUERY_KEYS } from '@/lib/queryKeys';

export function useLatestAgentRun(accountId: number | undefined, runType: string) {
  return useQuery({
    queryKey: QUERY_KEYS.agentLatest(accountId!, runType),
    queryFn: () =>
      api
        .get(`/agent/runs`, { params: { account_id: accountId, run_type: runType, limit: 1 } })
        .then((r) => {
          const data = r.data.data ?? r.data;
          return Array.isArray(data) ? data[0] ?? null : data;
        }),
    enabled: !!accountId,
    staleTime: 30_000,
  });
}

export function useRunAgent(accountId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { run_type: string; input_payload?: Record<string, unknown> }) =>
      api.post('/agent/run', { account_id: accountId, ...payload }),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.agentLatest(accountId, vars.run_type) });
      toast.success('Analysis complete');
    },
    onError: () => toast.error('Agent run failed'),
  });
}

export function useRunProspectAnalysis() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/agent/prospect', payload).then((r) => r.data.data ?? r.data),
    onError: () => toast.error('Analysis failed'),
  });
}

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

// ─── AI Agent Doc Analysis ───────────────────────────────────────────────────
// Calls the external agentic AI server at 172.16.0.28:5000 directly.
// Expects a .docx binary response; returns a Blob.
export function useRunDocAnalysis() {
  return useMutation({
    mutationFn: async (payload: {
      client_info: {
        company_name: string;
        industry: string;
        company_size: string;
        location: Record<string, unknown>;
        budget_range?: string;
      };
      requirements: Array<{
        category: string;
        description: string;
        priority: string;
        technical_specs: Record<string, unknown>;
        quantity_estimate?: number;
      }>;
    }) => {
      //const AGENT_BASE = 'http://172.16.0.28:5001';
      const AGENT_BASE = 'http://localhost:5001';

      // Step 1: trigger the agent — it generates and saves the .docx on its machine
      const chatRes = await fetch(`${AGENT_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!chatRes.ok) {
        const text = await chatRes.text();
        throw new Error(text || `Agent returned ${chatRes.status}`);
      }

      // Step 2: read the generated file directly from disk via the Vite dev-server
      // middleware (GET /agent-doc/proposal.docx → reads the local filesystem path).
      // No download endpoint on the agent server is needed.
      const docRes = await fetch('/agent-doc/proposal.docx', {
        cache: 'no-store', // always get the freshly generated file
      });
      if (!docRes.ok) {
        throw new Error(`Could not read generated document (${docRes.status})`);
      }
      return docRes.blob();
    },
    onError: (err: Error) => toast.error(`AI Agent Error: ${err.message}`),
  });
}

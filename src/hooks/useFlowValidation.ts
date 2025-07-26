import { useMemo } from 'react';
import type { Node, Edge } from 'reactflow';
import { validateFlow, type ValidationResult } from '../utils/flowValidation';

/**
 * Custom hook for flow validation
 */
export function useFlowValidation(nodes: Node[], edges: Edge[]): ValidationResult {
  return useMemo(() => {
    return validateFlow(nodes, edges);
  }, [nodes, edges]);
}

export default useFlowValidation;
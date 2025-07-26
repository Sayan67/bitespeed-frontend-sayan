import type { Node, Edge } from "reactflow";

export interface ValidationError {
  type: "error" | "warning";
  message: string;
  nodeId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates the chatbot flow with updated rules:
 * - Multiple starting points allowed
 * - Each node can have only one outgoing edge
 * - All nodes must be reachable from at least one starting point
 */
export function validateFlow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];

  // Rule 1: If there are no nodes, flow is invalid
  if (nodes.length === 0) {
    errors.push({
      type: "error",
      message: "Flow must contain at least one node",
    });
    return { isValid: false, errors };
  }

  // Rule 2: If there's only one node, it's valid
  if (nodes.length === 1) {
    return { isValid: true, errors: [] };
  }

  // Rule 3: Check for starting nodes (nodes without incoming connections)
  const nodesWithoutTargets = nodes.filter((node) => {
    return !edges.some((edge) => edge.target === node.id);
  });

  // Rule 4: Flow must have at least one starting node (but can have multiple)
  if (nodesWithoutTargets.length === 0) {
    errors.push({
      type: "error",
      message:
        "Flow must have at least one starting node (node without incoming connections)",
    });
  }

  // Rule 5: Check for nodes with empty messages
  const nodesWithEmptyMessages = nodes.filter((node) => {
    return !node.data?.message || node.data.message.trim() === "";
  });

  nodesWithEmptyMessages.forEach((node) => {
    errors.push({
      type: "warning",
      message: `Node "${node.id}" has no message content`,
      nodeId: node.id,
    });
  });

  // Rule 6: Check for disconnected components (unreachable nodes from any starting point)
  if (nodesWithoutTargets.length > 0) {
    const allReachableNodes = new Set<string>();
    
    // Get all nodes reachable from any starting point
    nodesWithoutTargets.forEach(startingNode => {
      const reachableFromThisStart = getReachableNodes(startingNode, nodes, edges);
      reachableFromThisStart.forEach(nodeId => allReachableNodes.add(nodeId));
    });
    
    // Find nodes that are not reachable from any starting point
    const unreachableNodes = nodes.filter(
      (node) => !allReachableNodes.has(node.id),
    );

    unreachableNodes.forEach((node) => {
      errors.push({
        type: "error",
        message: `Node "${node.data?.message || node.id}" is not reachable from any starting node`,
        nodeId: node.id,
      });
    });
  }

  const hasErrors = errors.some((error) => error.type === "error");
  return { isValid: !hasErrors, errors };
}

/**
 * Gets all nodes reachable from a starting node following the flow
 */
function getReachableNodes(
  startNode: Node,
  _allNodes: Node[],
  edges: Edge[],
): Set<string> {
  const reachable = new Set<string>();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;

    if (reachable.has(currentNodeId)) {
      continue;
    }

    reachable.add(currentNodeId);

    // Find all nodes connected from this node
    const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId);
    outgoingEdges.forEach((edge) => {
      if (!reachable.has(edge.target)) {
        queue.push(edge.target);
      }
    });
  }

  return reachable;
}

/**
 * Check if a flow can be saved (basic validation)
 */
export function canSaveFlow(nodes: Node[], edges: Edge[]): boolean {
  const validation = validateFlow(nodes, edges);
  return validation.isValid;
}

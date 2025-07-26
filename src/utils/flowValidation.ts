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
 * Validates the chatbot flow
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

  // Rule 3: Check for empty target handles (nodes without incoming connections)
  const nodesWithoutTargets = nodes.filter((node) => {
    return !edges.some((edge) => edge.target === node.id);
  });

  // Rule 4: If more than one node exists, only one node should have empty target handles
  if (nodesWithoutTargets.length === 0) {
    errors.push({
      type: "error",
      message:
        "Flow must have a starting node (node without incoming connections)",
    });
  } else if (nodesWithoutTargets.length > 1) {
    errors.push({
      type: "error",
      message:
        "Flow can only have one starting node (multiple nodes have no incoming connections)",
    });

    // Add specific error for each orphaned node
    nodesWithoutTargets.forEach((node) => {
      errors.push({
        type: "warning",
        message: `Node "${node.data?.message || node.id}" has no incoming connections`,
        nodeId: node.id,
      });
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

  // Rule 6: Check for disconnected components (unreachable nodes)
  const startingNodes = nodesWithoutTargets;
  if (startingNodes.length === 1) {
    const reachableNodes = getReachableNodes(startingNodes[0], nodes, edges);
    const unreachableNodes = nodes.filter(
      (node) => !reachableNodes.has(node.id),
    );

    unreachableNodes.forEach((node) => {
      errors.push({
        type: "error",
        message: `Node "${node.data?.message || node.id}" is not reachable from the starting node`,
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

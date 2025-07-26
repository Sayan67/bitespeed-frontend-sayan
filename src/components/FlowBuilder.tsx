import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type IsValidConnection,
} from "reactflow";
import FlowCanvas from "./FlowCanvas";
import NodesPanel from "./panels/NodesPanel";
import SettingsPanel from "./panels/SettingsPanel";
import ValidationPanel from "./panels/ValidationPanel";
import { validateFlow, type ValidationResult } from "../utils/flowValidation";
import { v4 as uuidv4 } from "uuid";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface FlowBuilderProps {
  onSaveStatusChange?: (canSave: boolean, saveFunction: () => boolean) => void;
}

const FlowBuilder: React.FC<FlowBuilderProps> = ({ onSaveStatusChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Save functionality - always enabled, validation happens on save attempt
  const saveFlow = useCallback(() => {
    const validation = validateFlow(nodes, edges);
    setValidationResult(validation);
    setShowValidation(true);

    if (validation.isValid) {
      console.log("Saving flow:", { nodes, edges });
      //make an API call to save the flow
      return true; // Indicate successful save
    }
    return false; // Indicate save failed due to validation
  }, [nodes, edges]);

  // Always allow save attempts - validation happens inside saveFlow
  useEffect(() => {
    if (onSaveStatusChange) {
      onSaveStatusChange(true, saveFlow);
    }
  }, [saveFlow, onSaveStatusChange]);

  // Hide validation when user makes changes after a failed save attempt
  useEffect(() => {
    if (showValidation) {
      setShowValidation(false);
    }
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Only allow connection if source handle doesn't already have an outgoing edge
      const sourceHasEdge = edges.some((edge) => edge.source === params.source);
      if (!sourceHasEdge) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [edges, setEdges],
  );

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      // Prevent self-connections
      if (connection.source === connection.target) {
        return false;
      }

      // Check if source already has an outgoing edge
      const sourceHasEdge = edges.some(
        (edge) => edge.source === connection.source,
      );
      return !sourceHasEdge;
    },
    [edges],
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onNodeUpdate = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...data } };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const onCloseSettings = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onNodeHighlight = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
      }
    },
    [nodes],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { message: "New message" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Validation Panel - only show when validation is triggered */}
      {showValidation && (
        <div className="p-3 bg-gray-50 border-b border-gray-200 shadow-sm">
          <ValidationPanel
            errors={validationResult.errors}
            onNodeHighlight={onNodeHighlight}
          />
        </div>
      )}

      {/* Main Flow Area */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100"
          ref={reactFlowWrapper}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            isValidConnection={isValidConnection}
          />
        </div>
        <div className="border-l border-gray-200 bg-white shadow-lg">
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onNodeUpdate={onNodeUpdate}
              onClose={onCloseSettings}
            />
          ) : (
            <NodesPanel />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;

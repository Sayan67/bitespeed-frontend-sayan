import React, { useCallback, useRef, useState } from 'react';
import {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type IsValidConnection,
} from 'reactflow';
import FlowCanvas from './FlowCanvas';
import NodesPanel from './panels/NodesPanel';
import SettingsPanel from './panels/SettingsPanel';
import { v4 as uuidv4 } from 'uuid';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      // Only allow connection if source handle doesn't already have an outgoing edge
      const sourceHasEdge = edges.some(edge => edge.source === params.source);
      if (!sourceHasEdge) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [edges, setEdges]
  );

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      // Prevent self-connections
      if (connection.source === connection.target) {
        return false;
      }

      // Check if source already has an outgoing edge
      const sourceHasEdge = edges.some(edge => edge.source === connection.source);
      return !sourceHasEdge;
    },
    [edges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onNodeUpdate = useCallback((nodeId: string, data: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onCloseSettings = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
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
        data: { message: 'New message' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="flex w-full h-full">
      <div 
        className="flex-1" 
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
  );
};

export default FlowBuilder;
import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type IsValidConnection,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./nodes/nodeTypes";

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: () => void;
  isValidConnection?: IsValidConnection;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  isValidConnection,
}) => {
  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          type: "smooth",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#999",
          },
          style: {
            stroke: "#999",
            strokeWidth: 2,
          },
        }}
        connectionLineStyle={{
          stroke: "#999",
          strokeWidth: 2,
        }}
        snapToGrid={true}
        snapGrid={[15, 15]}
        fitView
        className="bg-gray-50"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;

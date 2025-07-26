import React, { useCallback } from 'react';
import {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import FlowCanvas from './FlowCanvas';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textNode',
    position: { x: 100, y: 100 },
    data: { message: 'Hello! Welcome to our chatbot.' },
  },
  {
    id: '2',
    type: 'textNode',
    position: { x: 100, y: 250 },
    data: { message: 'How can I help you today?' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const FlowBuilder: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full">
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
};

export default FlowBuilder;
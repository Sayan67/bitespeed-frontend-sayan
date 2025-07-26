import React from 'react';

const NodesPanel: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Nodes Panel</h3>
      
      <div className="space-y-2">
        <div
          className="flex items-center gap-3 p-3 bg-white border-2 border-blue-500 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
          draggable
          onDragStart={(event) => onDragStart(event, 'textNode')}
        >
          <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
          <div>
            <div className="text-sm font-medium text-gray-800">Message</div>
            <div className="text-xs text-gray-500">Send a text message</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;
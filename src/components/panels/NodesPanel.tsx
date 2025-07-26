import { MessageCircleMore } from "lucide-react";
import React from "react";

const NodesPanel: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Available Nodes
      </h3>

      <div className="space-y-3">
        <div
          className="group flex flex-col items-center gap-3 p-3 bg-white border-2 border-blue-500 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-blue-600 transition-all duration-200 transform hover:scale-105"
          draggable
          onDragStart={(event) => onDragStart(event, "textNode")}
        >
          <MessageCircleMore />
          <div className="text-center flex flex-col items-center">
            <div className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
              Message
            </div>
            <div className="text-xs text-gray-500 group-hover:text-gray-600">
              Send a text message
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          Drag and drop nodes onto the canvas to build your chatbot flow
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;
